from fastapi import HTTPException
from models.models import CreateBookmark, UpdateBookmark, BookmarkOut
from database.database import Bookmark
from utils.utils import get_icon_url
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

async def show_bookmarks(current_user: int, db: Session):
    user = db.query(Bookmark).filter(Bookmark.user_id == current_user).all()
    bookmarks = [BookmarkOut.from_orm(u) for u in user]
    if not bookmarks:
        raise HTTPException(status_code=404, detail="Bookmarks not found")
    return bookmarks

async def show_one_bookmark(id: int, current_user: int, db: Session):
    user = db.query(Bookmark).filter(Bookmark.user_id == current_user).all()
    for u in user:
        if u.id == id:
            return BookmarkOut.from_orm(u)
        else:
            raise HTTPException(status_code=404, detail="Bookmarks not found")
        
async def show_one_bookmark_by_query(query: str, current_user: int, db: Session):
    results = db.query(Bookmark).filter(Bookmark.user_id == current_user).all()
    if results:
        all_results = [BookmarkOut.from_orm(bookmark) for bookmark in results if query in bookmark.description or query in bookmark.tags or query in bookmark.url]
        return all_results
    else:
        raise HTTPException(status_code=404, detail="Bookmarks not found")
    
async def creating_bookmark(bookmark: CreateBookmark, current_user: int, db: Session):
    existing_bookmark = db.query(Bookmark).filter(Bookmark.url == bookmark.url, Bookmark.user_id == current_user).first()
    icon_url = await get_icon_url(bookmark.url)
    if existing_bookmark:
        raise HTTPException(status_code=400, detail="Bookmark with this URL already exists.")
    new_bookmark = Bookmark(user_id=current_user, url=bookmark.url, title=bookmark.title,
                            description=bookmark.description, tags=bookmark.tags, favorite=bookmark.favorite, icon_url=icon_url)
    db.add(new_bookmark)
    try:
        db.commit()
    except IntegrityError:
        raise HTTPException(status_code=400, detail='Integrity error occured')
    db.refresh(new_bookmark)
    return {'message': 'Bookmark created!'}

async def updating_bookmark(id: int, bookmark: UpdateBookmark, current_user: int, db: Session):
    bookm = db.query(Bookmark).filter(Bookmark.id == id, Bookmark.user_id == current_user).first()
    if not bookm:
        raise HTTPException(status_code=404, detail="Bookmark not found.")
    bookm.url = bookmark.url
    bookm.title = bookmark.title
    bookm.description = bookmark.description
    bookm.tags = bookmark.tags
    bookm.favorite = bookmark.favorite
    db.commit()
    return {"message": "Bookmark updated!"}

async def deleting_bookmark(id: int, current_user: int, db: Session):
    result = db.query(Bookmark).filter(Bookmark.user_id == current_user).all()
    if result == 0:
        raise HTTPException(status_code=404, detail="Bookmark not found.")
    for bookmark in result:
        if bookmark.id == id:
            db.delete(bookmark)
    db.commit()
    return {"message": "Bookmark deleted!"}