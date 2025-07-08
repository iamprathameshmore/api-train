from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field
from pydantic import EmailStr

class UserModel(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: EmailStr = Field(unique=True)
    phoneNumber:str
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: Optional[datetime] = None

