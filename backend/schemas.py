from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from models import UserRole


class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: str
    organization: Optional[str] = None


class UserCreate(UserBase):
    password: str
    role: Optional[UserRole] = UserRole.USER


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    organization: Optional[str] = None
    avatar: Optional[str] = None


class UserResponse(UserBase):
    id: int
    role: str
    avatar: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


class LoginRequest(BaseModel):
    username: str
    password: str