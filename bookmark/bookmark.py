from fastapi import APIRouter, Depends
from models.models import CreateBookmark, UpdateBookmark
from database.database import Users, get_db
from auth.auth import get_current_user
from sqlalchemy.orm import Session
import bookmark.utils

bookmark_router = APIRouter()

@bookmark_router.get('/bookmarks/')
async def get_bookmarks(current_user: Users = Depends(get_current_user), db: Session = Depends(get_db)):
    await bookmark.utils.show_bookmarks(current_user=current_user.id, db=db)

@bookmark_router.get('/bookmarks/search_id')
async def get_one_bookmark(id: int, current_user: Users = Depends(get_current_user), db: Session = Depends(get_db)):
    await bookmark.utils.show_one_bookmark(id=id, current_user=current_user.id, db=db)
        
@bookmark_router.get('/bookmarks/search')
async def get_one_bookmark_by_query(query: str, current_user: Users = Depends(get_current_user), db: Session = Depends(get_db)):
    await bookmark.utils.show_one_bookmark_by_query(query=query, current_user=current_user.id, db=db)
            
@bookmark_router.post('/bookmarks/')
async def create_bookmark(bookmark: CreateBookmark, current_user: Users = Depends(get_current_user), db: Session = Depends(get_db)):
    await bookmark.utils.creating_bookmark(bookmark=bookmark, current_user=current_user.id, db=db)

@bookmark_router.put('/bookmarks/')
async def update_bookmark(id: int, bookmark: UpdateBookmark, current_user: Users = Depends(get_current_user), db: Session = Depends(get_db)):
    await bookmark.utils.updating_bookmark(id=id, bookmark=bookmark, current_user=current_user.id, db=db)

@bookmark_router.delete('/bookmarks/')
async def delete_bookmark(id: int, current_user: Users = Depends(get_current_user), db: Session = Depends(get_db)):
    await bookmark.utils.deleting_bookmark(id=id, current_user=current_user.id, db=db)

