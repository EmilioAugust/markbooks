from fastapi import FastAPI
from auth.auth import auth_router
from bookmark.bookmark import bookmark_router

app = FastAPI()
app.include_router(auth_router)
app.include_router(bookmark_router)

@app.get('/')
async def main():
    return {"message": "Welcome to Markbooks"}