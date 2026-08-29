# Step 3 — auth request/response schemas
from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

# TODO: StaffOut, RegisterRequest, ...
