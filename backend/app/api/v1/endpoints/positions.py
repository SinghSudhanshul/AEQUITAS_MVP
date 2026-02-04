"""
Aequitas LV-COP Backend - Position Endpoints
============================================

Position data upload and management endpoints.

Author: Aequitas Engineering
Version: 1.0.0
"""

import time
from datetime import date
from decimal import Decimal
from typing import Optional
from uuid import UUID, uuid4

from fastapi import APIRouter, File, HTTPException, Query, UploadFile, status
from fastapi.responses import StreamingResponse
from sqlalchemy import select, func

from app.dependencies import CurrentUser, DBSession, Pagination
from app.models.position import PositionSnapshot
from app.schemas.base import PaginatedResponse, ResponseModel
from app.schemas.position import (
    PortfolioSummary,
    PositionCreate,
    PositionListItem,
    PositionResponse,
    PositionUploadResponse,
)
from app.services.upload_service import UploadService

router = APIRouter()


@router.post(
    "/upload",
    response_model=ResponseModel[PositionUploadResponse],
    summary="Upload positions CSV",
    description="Upload position data from CSV file.",
)
async def upload_positions_csv(
    file: UploadFile = File(...),
    user: CurrentUser = None,
    db: DBSession = None,
    snapshot_date: Optional[date] = Query(None, description="Snapshot date"),
) -> ResponseModel[PositionUploadResponse]:
    """
    Upload positions from CSV file.
    
    Supports:
    - CSV format with configurable columns
    - Automatic column detection
    - Validation and error reporting
    - Up to 100K rows per upload
    """
    start_time = time.time()
    
    # Validate file type
    if not file.filename or not file.filename.endswith((".csv", ".xlsx", ".xls")):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Supported: CSV, XLSX, XLS",
        )
    
    # Read file content
    try:
        content = await file.read()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to read file: {e}",
        )
    
    # Validate file size (max 50MB)
    if len(content) > 50 * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File too large. Maximum size is 50MB.",
        )
    
    # Process with upload service
    upload_service = UploadService(db)
    
    try:
        result = await upload_service.process_positions_csv(
            file_content=content,
            organization_id=UUID(user["org_id"]),
            user_id=UUID(user["user_id"]),
            snapshot_date=snapshot_date,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    
    processing_time = int((time.time() - start_time) * 1000)
    
    return ResponseModel(
        success=True,
        data=PositionUploadResponse(
            upload_id=uuid4(),
            file_name=file.filename,
            rows_total=result.rows_total,
            rows_processed=result.rows_processed,
            rows_failed=result.rows_failed,
            positions_created=result.records_created,
            errors=result.errors[:10],  # Limit errors in response
            warnings=result.warnings[:10],
            processing_time_ms=processing_time,
        ),
        message=f"Processed {result.rows_processed} rows, created {result.records_created} positions",
    )


@router.get(
    "",
    response_model=PaginatedResponse[PositionListItem],
    summary="List positions",
    description="Get paginated list of positions.",
)
async def list_positions(
    user: CurrentUser,
    db: DBSession,
    pagination: Pagination,
    snapshot_date: Optional[date] = Query(None, description="Filter by date"),
    asset_class: Optional[str] = Query(None, description="Filter by asset class"),
    account_id: Optional[str] = Query(None, description="Filter by account"),
) -> PaginatedResponse[PositionListItem]:
    """List positions with filtering."""
    
    # Build query
    query = select(PositionSnapshot).where(
        PositionSnapshot.organization_id == UUID(user["org_id"])
    )
    
    if snapshot_date:
        query = query.where(PositionSnapshot.snapshot_date == snapshot_date)
    if asset_class:
        query = query.where(PositionSnapshot.asset_class == asset_class)
    if account_id:
        query = query.where(PositionSnapshot.account_id == account_id)
    
    # Count total
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total_items = total_result.scalar() or 0
    
    # Apply pagination
    query = query.order_by(PositionSnapshot.snapshot_date.desc())
    query = query.offset((pagination.page - 1) * pagination.page_size)
    query = query.limit(pagination.page_size)
    
    result = await db.execute(query)
    positions = result.scalars().all()
    
    # Convert to list items
    items = [
        PositionListItem(
            id=p.id,
            snapshot_date=p.snapshot_date,
            security_id=p.security_id,
            security_name=p.security_name,
            ticker=p.ticker,
            asset_class=p.asset_class,
            quantity=p.quantity,
            price=p.price,
            market_value=p.market_value,
            currency=p.currency,
            account_id=p.account_id,
        )
        for p in positions
    ]
    
    total_pages = (total_items + pagination.page_size - 1) // pagination.page_size
    
    return PaginatedResponse(
        data=items,
        pagination={
            "page": pagination.page,
            "page_size": pagination.page_size,
            "total_items": total_items,
            "total_pages": total_pages,
            "has_next": pagination.page < total_pages,
            "has_prev": pagination.page > 1,
        },
    )


@router.get(
    "/summary",
    response_model=ResponseModel[PortfolioSummary],
    summary="Get portfolio summary",
    description="Get aggregated portfolio summary.",
)
async def get_portfolio_summary(
    user: CurrentUser,
    db: DBSession,
    snapshot_date: Optional[date] = Query(None, description="Snapshot date"),
) -> ResponseModel[PortfolioSummary]:
    """Get portfolio summary with aggregations."""
    
    target_date = snapshot_date or date.today()
    org_id = UUID(user["org_id"])
    
    # Get positions for the date
    query = select(PositionSnapshot).where(
        PositionSnapshot.organization_id == org_id,
        PositionSnapshot.snapshot_date == target_date,
    )
    
    result = await db.execute(query)
    positions = result.scalars().all()
    
    if not positions:
        return ResponseModel(
            data=PortfolioSummary(
                organization_id=org_id,
                snapshot_date=target_date,
                total_market_value=Decimal("0"),
                total_positions=0,
                total_securities=0,
                by_asset_class={},
                by_currency={},
                by_sector={},
                top_positions=[],
            ),
        )
    
    # Calculate aggregates
    total_value = sum(p.market_value or Decimal("0") for p in positions)
    unique_securities = set(p.security_id for p in positions)
    
    by_asset_class = {}
    by_currency = {}
    by_sector = {}
    
    for p in positions:
        mv = float(p.market_value or 0)
        
        # By asset class
        ac = p.asset_class or "other"
        by_asset_class[ac] = by_asset_class.get(ac, 0) + mv
        
        # By currency
        curr = p.currency or "USD"
        by_currency[curr] = by_currency.get(curr, 0) + mv
        
        # By sector
        sector = p.sector or "Unknown"
        by_sector[sector] = by_sector.get(sector, 0) + mv
    
    # Top positions
    sorted_positions = sorted(positions, key=lambda p: p.market_value or 0, reverse=True)
    top_positions = [
        {
            "security_id": p.security_id,
            "security_name": p.security_name,
            "market_value": float(p.market_value or 0),
            "weight": float(p.market_value or 0) / float(total_value) if total_value else 0,
        }
        for p in sorted_positions[:10]
    ]
    
    return ResponseModel(
        data=PortfolioSummary(
            organization_id=org_id,
            snapshot_date=target_date,
            total_market_value=total_value,
            total_positions=len(positions),
            total_securities=len(unique_securities),
            by_asset_class=by_asset_class,
            by_currency=by_currency,
            by_sector=by_sector,
            top_positions=top_positions,
        ),
    )


@router.post(
    "",
    response_model=ResponseModel[PositionResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Create position",
    description="Create a single position record.",
)
async def create_position(
    position: PositionCreate,
    user: CurrentUser,
    db: DBSession,
) -> ResponseModel[PositionResponse]:
    """Create a single position."""
    from app.models.position import PositionSnapshot
    
    new_position = PositionSnapshot(
        id=uuid4(),
        organization_id=UUID(user["org_id"]),
        uploaded_by=UUID(user["user_id"]),
        snapshot_date=position.snapshot_date,
        security_id=position.security_id,
        security_name=position.security_name,
        ticker=position.ticker,
        isin=position.isin,
        asset_class=position.asset_class or "equity",
        quantity=position.quantity,
        price=position.price,
        market_value=position.market_value or (position.quantity * position.price),
        currency=position.currency or "USD",
        account_id=position.account_id,
        portfolio_id=position.portfolio_id,
        sector=position.sector,
        country=position.country,
        source="api",
        is_validated=True,
    )
    
    db.add(new_position)
    await db.commit()
    await db.refresh(new_position)
    
    return ResponseModel(
        success=True,
        data=PositionResponse(
            id=new_position.id,
            snapshot_date=new_position.snapshot_date,
            security_id=new_position.security_id,
            security_name=new_position.security_name,
            ticker=new_position.ticker,
            isin=new_position.isin,
            asset_class=new_position.asset_class,
            quantity=new_position.quantity,
            price=new_position.price,
            market_value=new_position.market_value,
            currency=new_position.currency,
            account_id=new_position.account_id,
            portfolio_id=new_position.portfolio_id,
            created_at=new_position.created_at,
        ),
        message="Position created",
    )


@router.get(
    "/{position_id}",
    response_model=ResponseModel[PositionResponse],
    summary="Get position",
    description="Get a specific position by ID.",
)
async def get_position(
    position_id: UUID,
    user: CurrentUser,
    db: DBSession,
) -> ResponseModel[PositionResponse]:
    """Get position by ID."""
    result = await db.execute(
        select(PositionSnapshot).where(
            PositionSnapshot.id == position_id,
            PositionSnapshot.organization_id == UUID(user["org_id"]),
        )
    )
    position = result.scalar_one_or_none()
    
    if not position:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Position not found",
        )
    
    return ResponseModel(
        data=PositionResponse(
            id=position.id,
            snapshot_date=position.snapshot_date,
            security_id=position.security_id,
            security_name=position.security_name,
            ticker=position.ticker,
            isin=position.isin,
            asset_class=position.asset_class,
            quantity=position.quantity,
            price=position.price,
            market_value=position.market_value,
            currency=position.currency,
            account_id=position.account_id,
            portfolio_id=position.portfolio_id,
            created_at=position.created_at,
        ),
    )


@router.delete(
    "/{position_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete position",
    description="Delete a position record.",
)
async def delete_position(
    position_id: UUID,
    user: CurrentUser,
    db: DBSession,
) -> None:
    """Delete a position."""
    result = await db.execute(
        select(PositionSnapshot).where(
            PositionSnapshot.id == position_id,
            PositionSnapshot.organization_id == UUID(user["org_id"]),
        )
    )
    position = result.scalar_one_or_none()
    
    if not position:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Position not found",
        )
    
    await db.delete(position)
    await db.commit()


@router.get(
    "/dates/available",
    response_model=ResponseModel[list[date]],
    summary="Get available dates",
    description="Get list of dates with position data.",
)
async def get_available_dates(
    user: CurrentUser,
    db: DBSession,
) -> ResponseModel[list[date]]:
    """Get dates with position data."""
    result = await db.execute(
        select(PositionSnapshot.snapshot_date)
        .where(PositionSnapshot.organization_id == UUID(user["org_id"]))
        .distinct()
        .order_by(PositionSnapshot.snapshot_date.desc())
        .limit(100)
    )
    dates = [row[0] for row in result.all()]
    
    return ResponseModel(data=dates)


@router.get(
    "/template",
    summary="Download CSV template",
    description="Download a template CSV file for position upload.",
)
async def download_template(
    user: CurrentUser,
) -> StreamingResponse:
    """Get CSV template for download."""
    import io
    
    csv_content = """date,security_id,security_name,ticker,isin,asset_class,quantity,price,market_value,currency,account_id,sector,country
2024-01-15,AAPL,Apple Inc.,AAPL,US0378331005,equity,100,185.50,18550.00,USD,MAIN,Technology,US
2024-01-15,GOOGL,Alphabet Inc.,GOOGL,US02079K3059,equity,50,141.80,7090.00,USD,MAIN,Technology,US
2024-01-15,MSFT,Microsoft Corp.,MSFT,US5949181045,equity,75,402.50,30187.50,USD,MAIN,Technology,US
"""
    
    return StreamingResponse(
        io.BytesIO(csv_content.encode()),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=position_upload_template.csv"},
    )
