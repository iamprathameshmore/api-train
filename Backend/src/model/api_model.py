from beanie import Document, Link
from pydantic import EmailStr, Field
from typing import Optional
from datetime import datetime
from uuid import uuid4

class APIModel(Document):
    email: EmailStr
    username: str
    api_name: str
    api_path: str
    model_name: str
    model_type: str
    model_path: str
    version: int = 1
    is_active: bool = True
    api_key: str = Field(default_factory=lambda: uuid4().hex)
    api_count: int = 0
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: Optional[datetime] = None

    class Settings:
        name = "api_models"

class APIKeyModel(Document):
    api_model: Link[APIModel]
    key: str = Field(default_factory=lambda: uuid4().hex)
    is_active: bool = True
    createdAt: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "api_keys"

class AuditLogModel(Document):
    user_id: str
    action: str
    target_type: str
    target_id: str
    details: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "audit_logs"
