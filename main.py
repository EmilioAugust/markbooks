from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from auth.auth import auth_router
from bookmark.bookmark import bookmark_router

app = FastAPI()
app.include_router(auth_router)
app.include_router(bookmark_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500", "http://localhost:5500", "http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

@app.get('/')
async def main():
    return {"message": "Welcome to Markbooks"}