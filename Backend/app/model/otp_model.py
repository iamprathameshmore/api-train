from sqlmodel import SQLModel, Field
from datetime import datetime

class OtpModel(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    email: str
    otp: str
    purpose: str | None = None  # optional: "login" or "signup"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: datetime