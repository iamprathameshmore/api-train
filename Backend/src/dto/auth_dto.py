from pydantic import BaseModel, EmailStr
from typing import Optional


class SignupDTO(BaseModel):
    name: str
    email: EmailStr
    phoneNumber: Optional[str]


class LoginDTO(BaseModel):
    email: EmailStr


class VerifyOtpDTO(BaseModel):
    email: EmailStr
    otp: str
