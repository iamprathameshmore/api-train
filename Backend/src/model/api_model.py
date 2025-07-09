from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field
from pydantic import EmailStr
from uuid import uuid4


class APIModel(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    
    email: EmailStr  # User's email
    username: str  # Extracted from email before '@'
    
    api_name: str  # Display name
    api_path: str  # Route or endpoint path
    
    model_name: str  # Technical model name
    model_type: str  # linear_regression, decision_tree, etc.
    model_path: str  # Path to saved .pkl model
    
    api_key: str = Field(default_factory=lambda: uuid4().hex)  # unique identifier for public API access
    api_count: int = 0  # Optional: track how many times used
    
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: Optional[datetime] = None
