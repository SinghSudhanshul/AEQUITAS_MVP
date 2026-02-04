"""
Aequitas LV-COP Backend - Upload Service
========================================

CSV and Excel file upload and parsing service.

Author: Aequitas Engineering
Version: 1.0.0
"""

import csv
import io
import logging
from datetime import date, datetime
from decimal import Decimal, InvalidOperation
from typing import Any, Optional
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.core.constants import MAX_ROWS_PER_UPLOAD, MAX_UPLOAD_SIZE_MB
from app.core.enums import AssetClass, Currency
from app.exceptions import ValidationError
from app.models.position import PositionSnapshot
from app.models.transaction import Transaction

logger = logging.getLogger(__name__)


class UploadResult:
    """Result of file upload processing."""
    
    def __init__(self):
        self.rows_total = 0
        self.rows_processed = 0
        self.rows_failed = 0
        self.records_created = 0
        self.errors: list[dict] = []
        self.warnings: list[dict] = []
    
    def add_error(self, row: int, field: str, message: str) -> None:
        """Add an error."""
        self.errors.append({
            "row": row,
            "field": field,
            "message": message,
        })
        self.rows_failed += 1
    
    def add_warning(self, row: int, field: str, message: str) -> None:
        """Add a warning."""
        self.warnings.append({
            "row": row,
            "field": field,
            "message": message,
        })


class UploadService:
    """
    Service for handling file uploads.
    
    Supports:
    - CSV position uploads
    - CSV transaction uploads
    - Excel files (xlsx, xls)
    - Automatic column mapping
    - Validation and error reporting
    """
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def process_positions_csv(
        self,
        file_content: bytes,
        organization_id: UUID,
        user_id: UUID,
        snapshot_date: Optional[date] = None,
        column_mapping: Optional[dict[str, str]] = None,
    ) -> UploadResult:
        """
        Process a positions CSV file.
        
        Args:
            file_content: Raw file bytes
            organization_id: Organization ID
            user_id: Uploading user ID
            snapshot_date: Override date for all rows
            column_mapping: Custom column name mapping
        
        Returns:
            UploadResult with processing details
        """
        result = UploadResult()
        
        # Default column mapping
        mapping = column_mapping or {
            "date": "snapshot_date",
            "security_id": "security_id",
            "security_name": "security_name",
            "ticker": "ticker",
            "isin": "isin",
            "asset_class": "asset_class",
            "quantity": "quantity",
            "price": "price",
            "market_value": "market_value",
            "currency": "currency",
            "account_id": "account_id",
            "portfolio_id": "portfolio_id",
            "sector": "sector",
            "country": "country",
        }
        
        try:
            # Decode and parse CSV
            content = file_content.decode("utf-8-sig")  # Handle BOM
            reader = csv.DictReader(io.StringIO(content))
            
            # Validate row count
            rows = list(reader)
            result.rows_total = len(rows)
            
            if result.rows_total > MAX_ROWS_PER_UPLOAD:
                raise ValidationError(
                    f"File exceeds maximum of {MAX_ROWS_PER_UPLOAD:,} rows",
                    errors=[{
                        "field": "file",
                        "message": f"Maximum {MAX_ROWS_PER_UPLOAD:,} rows allowed",
                    }],
                )
            
            # Process rows
            positions_to_create = []
            
            for row_num, row in enumerate(rows, start=2):  # Start at 2 (header is row 1)
                try:
                    position = self._parse_position_row(
                        row=row,
                        row_num=row_num,
                        mapping=mapping,
                        organization_id=organization_id,
                        user_id=user_id,
                        override_date=snapshot_date,
                        result=result,
                    )
                    if position:
                        positions_to_create.append(position)
                        result.rows_processed += 1
                except Exception as e:
                    result.add_error(row_num, "row", str(e))
            
            # Bulk insert
            if positions_to_create:
                self.db.add_all(positions_to_create)
                await self.db.commit()
                result.records_created = len(positions_to_create)
            
            logger.info(
                f"Processed positions upload: {result.rows_processed}/{result.rows_total} "
                f"rows, {result.records_created} created, {result.rows_failed} failed"
            )
            
            return result
            
        except UnicodeDecodeError:
            raise ValidationError("File must be UTF-8 encoded")
        except csv.Error as e:
            raise ValidationError(f"Invalid CSV format: {e}")
    
    def _parse_position_row(
        self,
        row: dict[str, Any],
        row_num: int,
        mapping: dict[str, str],
        organization_id: UUID,
        user_id: UUID,
        override_date: Optional[date],
        result: UploadResult,
    ) -> Optional[PositionSnapshot]:
        """Parse a single row into a PositionSnapshot."""
        
        # Get mapped values
        def get_value(field: str) -> Optional[str]:
            for csv_col, model_field in mapping.items():
                if model_field == field and csv_col in row:
                    return row[csv_col].strip() if row[csv_col] else None
            return None
        
        # Required fields
        security_id = get_value("security_id")
        if not security_id:
            result.add_error(row_num, "security_id", "Security ID is required")
            return None
        
        quantity_str = get_value("quantity")
        price_str = get_value("price")
        
        if not quantity_str:
            result.add_error(row_num, "quantity", "Quantity is required")
            return None
        
        if not price_str:
            result.add_error(row_num, "price", "Price is required")
            return None
        
        # Parse date
        if override_date:
            snapshot_date = override_date
        else:
            date_str = get_value("snapshot_date")
            if date_str:
                try:
                    snapshot_date = self._parse_date(date_str)
                except ValueError:
                    result.add_error(row_num, "date", f"Invalid date format: {date_str}")
                    return None
            else:
                snapshot_date = date.today()
        
        # Parse numeric fields
        try:
            quantity = Decimal(quantity_str.replace(",", ""))
        except InvalidOperation:
            result.add_error(row_num, "quantity", f"Invalid number: {quantity_str}")
            return None
        
        try:
            price = Decimal(price_str.replace(",", ""))
        except InvalidOperation:
            result.add_error(row_num, "price", f"Invalid number: {price_str}")
            return None
        
        # Calculate or parse market value
        market_value_str = get_value("market_value")
        if market_value_str:
            try:
                market_value = Decimal(market_value_str.replace(",", ""))
            except InvalidOperation:
                market_value = quantity * price
                result.add_warning(row_num, "market_value", "Invalid value, calculated from qty*price")
        else:
            market_value = quantity * price
        
        # Parse optional fields
        currency = get_value("currency") or "USD"
        if currency not in [c.value for c in Currency]:
            result.add_warning(row_num, "currency", f"Unknown currency {currency}, using USD")
            currency = "USD"
        
        asset_class = get_value("asset_class") or "equity"
        if asset_class.lower() not in [a.value for a in AssetClass]:
            asset_class = "equity"
        
        # Create position
        return PositionSnapshot(
            organization_id=organization_id,
            uploaded_by=user_id,
            snapshot_date=snapshot_date,
            security_id=security_id,
            security_name=get_value("security_name"),
            ticker=get_value("ticker"),
            isin=get_value("isin"),
            asset_class=asset_class,
            quantity=quantity,
            price=price,
            market_value=market_value,
            currency=currency,
            account_id=get_value("account_id"),
            portfolio_id=get_value("portfolio_id"),
            sector=get_value("sector"),
            country=get_value("country"),
            source="csv_upload",
            is_validated=True,
        )
    
    def _parse_date(self, date_str: str) -> date:
        """Parse date string in various formats."""
        formats = [
            "%Y-%m-%d",
            "%m/%d/%Y",
            "%d/%m/%Y",
            "%Y/%m/%d",
            "%m-%d-%Y",
            "%d-%m-%Y",
        ]
        
        for fmt in formats:
            try:
                return datetime.strptime(date_str, fmt).date()
            except ValueError:
                continue
        
        raise ValueError(f"Unrecognized date format: {date_str}")
    
    async def process_transactions_csv(
        self,
        file_content: bytes,
        organization_id: UUID,
        user_id: UUID,
        column_mapping: Optional[dict[str, str]] = None,
    ) -> UploadResult:
        """
        Process a transactions CSV file.
        
        Similar to positions but for transaction data.
        """
        result = UploadResult()
        
        # TODO: Implement transaction CSV parsing
        # Similar structure to positions
        
        return result
    
    async def validate_file(
        self,
        filename: str,
        file_size: int,
    ) -> None:
        """
        Validate file before processing.
        
        Args:
            filename: Original filename
            file_size: File size in bytes
        
        Raises:
            ValidationError: If file is invalid
        """
        # Check extension
        if not any(filename.lower().endswith(ext) for ext in [".csv", ".xlsx", ".xls"]):
            raise ValidationError(
                "Unsupported file type",
                errors=[{"field": "file", "message": "Supported formats: CSV, XLSX, XLS"}],
            )
        
        # Check size
        max_bytes = MAX_UPLOAD_SIZE_MB * 1024 * 1024
        if file_size > max_bytes:
            raise ValidationError(
                f"File too large. Maximum size is {MAX_UPLOAD_SIZE_MB}MB",
                errors=[{"field": "file", "message": f"Maximum size is {MAX_UPLOAD_SIZE_MB}MB"}],
            )
