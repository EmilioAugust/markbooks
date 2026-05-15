from fastapi import APIRouter, Depends
from models.models import CreateBookmark, UpdateBookmark
from database.database import Users, get_db
from auth.auth import get_current_user
from sqlalchemy.orm import Session
from bookmark.utils import show_bookmarks, show_one_bookmark, show_one_bookmark_by_query, creating_bookmark, updating_bookmark, deleting_bookmark

bookmark_router = APIRouter()

@bookmark_router.get('/bookmarks/')
async def get_bookmarks(current_user: Users = Depends(get_current_user), db: Session = Depends(get_db)):
    return await show_bookmarks(current_user=current_user.id, db=db)

@bookmark_router.get('/bookmarks/search_id')
async def get_one_bookmark(id: int, current_user: Users = Depends(get_current_user), db: Session = Depends(get_db)):
    return await show_one_bookmark(id=id, current_user=current_user.id, db=db)
        
@bookmark_router.get('/bookmarks/search')
async def get_one_bookmark_by_query(query: str, current_user: Users = Depends(get_current_user), db: Session = Depends(get_db)):
    return await show_one_bookmark_by_query(query=query, current_user=current_user.id, db=db)
            
@bookmark_router.post('/bookmarks/')
async def create_bookmark(create_bookmark_model: CreateBookmark, current_user: Users = Depends(get_current_user), db: Session = Depends(get_db)):
    return await creating_bookmark(bookmark=create_bookmark_model, current_user=current_user.id, db=db)

@bookmark_router.put('/bookmarks/')
async def update_bookmark(id: int, create_bookmark_model: UpdateBookmark, current_user: Users = Depends(get_current_user), db: Session = Depends(get_db)):
    return await updating_bookmark(id=id, bookmark=create_bookmark_model, current_user=current_user.id, db=db)

@bookmark_router.delete('/bookmarks/')
async def delete_bookmark(id: int, current_user: Users = Depends(get_current_user), db: Session = Depends(get_db)):
    return await deleting_bookmark(id=id, current_user=current_user.id, db=db)

