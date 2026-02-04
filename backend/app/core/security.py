"""
Aequitas LV-COP Backend - Core Security
=======================================

Password hashing, encryption, and security utilities.

Author: Aequitas Engineering
Version: 1.0.0
"""

import base64
import hashlib
import hmac
import secrets
from typing import Optional

from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from passlib.context import CryptContext

from app.config import settings


# Password hashing context
pwd_context = CryptContext(
    schemes=["argon2", "bcrypt"],
    deprecated="auto",
    argon2__memory_cost=65536,
    argon2__time_cost=3,
    argon2__parallelism=4,
)


def hash_password(password: str) -> str:
    """
    Hash a password using Argon2.
    
    Args:
        password: Plain text password
    
    Returns:
        Hashed password string
    """
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a password against its hash.
    
    Args:
        plain_password: Plain text password
        hashed_password: Hashed password to compare
    
    Returns:
        True if password matches
    """
    return pwd_context.verify(plain_password, hashed_password)


def generate_api_key() -> tuple[str, str]:
    """
    Generate a new API key.
    
    Returns:
        Tuple of (key_id, secret_key)
    """
    key_id = f"ak_{secrets.token_urlsafe(8)}"
    secret_key = secrets.token_urlsafe(32)
    return key_id, secret_key


def hash_api_key(api_key: str) -> str:
    """
    Hash an API key for storage.
    
    Args:
        api_key: API key to hash
    
    Returns:
        SHA-256 hash of the key
    """
    return hashlib.sha256(api_key.encode()).hexdigest()


# =============================================================================
# ENCRYPTION (AES-256)
# =============================================================================

_fernet: Optional[Fernet] = None


def _get_fernet() -> Fernet:
    """Get or create Fernet encryption instance."""
    global _fernet
    
    if _fernet is None:
        if not settings.ENCRYPTION_KEY:
            raise ValueError("ENCRYPTION_KEY not configured")
        
        # Derive key from password
        salt = (settings.ENCRYPTION_SALT or "aequitas-salt").encode()
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=100000,
        )
        key = base64.urlsafe_b64encode(
            kdf.derive(settings.ENCRYPTION_KEY.encode())
        )
        _fernet = Fernet(key)
    
    return _fernet


def encrypt(data: str) -> str:
    """
    Encrypt a string using AES-256.
    
    Args:
        data: String to encrypt
    
    Returns:
        Base64-encoded encrypted string
    """
    fernet = _get_fernet()
    encrypted = fernet.encrypt(data.encode())
    return encrypted.decode()


def decrypt(encrypted_data: str) -> str:
    """
    Decrypt an AES-256 encrypted string.
    
    Args:
        encrypted_data: Base64-encoded encrypted string
    
    Returns:
        Decrypted string
    """
    fernet = _get_fernet()
    decrypted = fernet.decrypt(encrypted_data.encode())
    return decrypted.decode()


def encrypt_dict(data: dict) -> str:
    """
    Encrypt a dictionary as JSON.
    
    Args:
        data: Dictionary to encrypt
    
    Returns:
        Encrypted JSON string
    """
    import json
    return encrypt(json.dumps(data))


def decrypt_dict(encrypted_data: str) -> dict:
    """
    Decrypt a dictionary from encrypted JSON.
    
    Args:
        encrypted_data: Encrypted JSON string
    
    Returns:
        Decrypted dictionary
    """
    import json
    return json.loads(decrypt(encrypted_data))


# =============================================================================
# SECURE TOKEN GENERATION
# =============================================================================

def generate_secure_token(length: int = 32) -> str:
    """
    Generate a cryptographically secure random token.
    
    Args:
        length: Token length in bytes
    
    Returns:
        URL-safe base64-encoded token
    """
    return secrets.token_urlsafe(length)


def generate_verification_code(length: int = 6) -> str:
    """
    Generate a numeric verification code.
    
    Args:
        length: Number of digits
    
    Returns:
        Numeric code string
    """
    return "".join(secrets.choice("0123456789") for _ in range(length))


# =============================================================================
# HMAC SIGNATURES
# =============================================================================

def create_signature(data: str, key: Optional[str] = None) -> str:
    """
    Create HMAC-SHA256 signature.
    
    Args:
        data: Data to sign
        key: Signing key (defaults to SECRET_KEY)
    
    Returns:
        Hex-encoded signature
    """
    signing_key = (key or settings.SECRET_KEY).encode()
    signature = hmac.new(signing_key, data.encode(), hashlib.sha256)
    return signature.hexdigest()


def verify_signature(data: str, signature: str, key: Optional[str] = None) -> bool:
    """
    Verify HMAC-SHA256 signature.
    
    Args:
        data: Original data
        signature: Signature to verify
        key: Signing key (defaults to SECRET_KEY)
    
    Returns:
        True if signature is valid
    """
    expected = create_signature(data, key)
    return hmac.compare_digest(signature, expected)


# =============================================================================
# UTILITY FUNCTIONS
# =============================================================================

def mask_string(value: str, visible_chars: int = 4) -> str:
    """
    Mask a string, showing only first/last characters.
    
    Args:
        value: String to mask
        visible_chars: Number of chars to show at start/end
    
    Returns:
        Masked string (e.g., "abcd****efgh")
    """
    if len(value) <= visible_chars * 2:
        return "*" * len(value)
    
    return f"{value[:visible_chars]}{'*' * (len(value) - visible_chars * 2)}{value[-visible_chars:]}"


def sanitize_log_data(data: dict, sensitive_keys: set[str] | None = None) -> dict:
    """
    Sanitize data for logging, removing sensitive information.
    
    Args:
        data: Dictionary to sanitize
        sensitive_keys: Keys to mask (defaults to common sensitive keys)
    
    Returns:
        Sanitized dictionary
    """
    default_sensitive = {
        "password", "api_key", "api_secret", "access_token",
        "refresh_token", "secret", "credential", "authorization",
    }
    
    keys_to_mask = sensitive_keys or default_sensitive
    result = {}
    
    for key, value in data.items():
        if any(k in key.lower() for k in keys_to_mask):
            result[key] = "[REDACTED]"
        elif isinstance(value, dict):
            result[key] = sanitize_log_data(value, keys_to_mask)
        else:
            result[key] = value
    
    return result
