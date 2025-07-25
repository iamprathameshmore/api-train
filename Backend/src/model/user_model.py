from beanie import Document
from pydantic import EmailStr, Field
from typing import Optional
from datetime import datetime

class UserModel(Document):
    name: str
    email: EmailStr
    phoneNumber: str
    otp: Optional[str] = None
    expires_at: Optional[datetime] = None
    purpose: Optional[str] = None
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: Optional[datetime] = None
    webhook_url: Optional[str] = None
    role: str = Field(default="user")

    class Settings:
        name = "users"
