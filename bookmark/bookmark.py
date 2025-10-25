from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy import or_
from models.models import CreateBookmark, UpdateBookmark, BookmarkOut
from database.database import Session, Bookmark, Users
from auth.auth import protected_route
from parser.parser import get_title_website
from sqlalchemy.exc import IntegrityError

bookmark_router = APIRouter()
session = Session()

@bookmark_router.get('/bookmarks/')
async def get_bookmarks(current_user: Users = Depends(protected_route)):
    user = session.query(Bookmark).filter(Bookmark.user_id == current_user.id).all()
    bookmarks = [BookmarkOut.from_orm(u) for u in user]
    return bookmarks

@bookmark_router.get('/bookmarks/search_id')
async def get_one_bookmark(id: int, current_user: Users = Depends(protected_route)):
    user = session.query(Bookmark).filter(Bookmark.user_id == current_user.id).all()
    for u in user:
        if u.id == id:
            return BookmarkOut.from_orm(u)
        
@bookmark_router.get('/bookmarks/search')
async def get_one_bookmark_by_query(query: str, current_user: Users = Depends(protected_route)):
    results = session.query(Bookmark).filter(Bookmark.user_id == current_user.id).all()
    if results:
        all_results = [BookmarkOut.from_orm(bookmark) for bookmark in results if query in bookmark.description or query in bookmark.tags or query in bookmark.url]
        return all_results
            
@bookmark_router.post('/bookmarks/')
async def create_bookmark(bookmark: CreateBookmark, current_user: Users = Depends(protected_route)):
    existing_bookmark = session.query(Bookmark).filter(Bookmark.url == bookmark.url, Bookmark.user_id == current_user.id).first()
    if existing_bookmark:
        raise HTTPException(status_code=400, detail="Bookmark with this URL already exists for this user.")
    new_bookmark = Bookmark(user_id=current_user.id, url=bookmark.url, title=bookmark.title, description=bookmark.description, tags=bookmark.tags)
    if new_bookmark.title == "":
        new_bookmark.title = await get_title_website(new_bookmark.url)
    session.add(new_bookmark)
    try:
        session.commit()
    except IntegrityError:
        raise HTTPException(status_code=400, detail='Integrity error occured')
    session.refresh(new_bookmark)
    return {'message': 'Bookmark created!'}

@bookmark_router.put('/bookmarks/')
async def update_bookmark(id: int, bookmark: UpdateBookmark, current_user: Users = Depends(protected_route)):
    bookm = session.query(Bookmark).filter(Bookmark.id == id, Bookmark.user_id == current_user.id).first()
    if not bookm:
        raise HTTPException(status_code=404, detail="Bookmark not found.")
    bookm.url = bookmark.url
    bookm.title = bookmark.title
    bookm.description = bookmark.description
    bookm.tags = bookmark.tags
    session.commit()
    return {"message": "Bookmark updated!"}

@bookmark_router.delete('/bookmarks/')
async def delete_bookmark(id: int, current_user: Users = Depends(protected_route)):
    result = session.query(Bookmark).filter(Bookmark.user_id == current_user.id).all()
    if result == 0:
        raise HTTPException(status_code=404, detail="Bookmark not found.")
    for bookmark in result:
        if bookmark.id == id:
            session.delete(bookmark)
    session.commit()
    return {"message": "Bookmark deleted!"}

