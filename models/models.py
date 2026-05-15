from pydantic import BaseModel, EmailStr
from typing import Optional, List

class CreateUser(BaseModel):
    username: str
    email: EmailStr
    password: str

class CreateBookmark(BaseModel):
    url: str
    title: Optional[str | None] = None
    description: Optional[str | None] = None
    tags: Optional[List | None] = None
    favorite: bool = False

class UpdateBookmark(BaseModel):
    url: str
    title: Optional[str | None] = None
    description: Optional[str | None] = None
    tags: Optional[List | None] = None
    favorite: bool = False

class BookmarkOut(BaseModel):
    id: int
    url: str
    title: Optional[str | None] = None
    description: Optional[str | None] = None
    tags: Optional[str | None] = None
    favorite: bool = False

    class Config:
        orm_mode = True
        from_attributes = True