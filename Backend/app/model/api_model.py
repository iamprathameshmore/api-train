from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field
from uuid import uuid4

class APIModel(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    api_name: str
    api_path: str
    api_key: str = Field(default_factory=lambda: uuid4().hex)  # unique key per model/API
    model_name: str
    model_path: str
    api_count: int = 0  # use integer for counting, not string
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: Optional[datetime] = None
