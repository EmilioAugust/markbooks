from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from database.database import Session, Users
from models.models import CreateUser
from services.services import get_password_hash, verify_password, create_access_token, decode_token
from datetime import timedelta

auth_router = APIRouter(prefix='/auth', tags=['auth'])
session = Session()
oauth2_bearer = OAuth2PasswordBearer(tokenUrl='auth/token')

@auth_router.post('/register')
async def register_user(user: CreateUser):
    existing_user = session.query(Users).filter(Users.username == user.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists.")
    hashed_password = await get_password_hash(user.password)
    new_user = Users(username=user.username, email=user.email, hashed_password=hashed_password)

    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    return {'message': 'User registered!'}

@auth_router.post('/token')
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = session.query(Users).filter(Users.username == form_data.username).first()
    if not user or not await verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail='Wrong username or password')
    access_token = await create_access_token(data={'id': user.id}, expires_delta=timedelta(days=10))
    return {'access_token': access_token, 'token_type': 'bearer'}

@auth_router.get('/protected/')
async def protected_route(token: str = Depends(oauth2_bearer)):
    payload = await decode_token(token)
    user_id = payload.get('id')
    existing_user = session.query(Users).filter(Users.id == user_id).first()
    if payload is None:
        raise HTTPException(status_code=401, detail='Wrong token')
    if not existing_user:
        raise HTTPException(status_code=401, detail='User not found')
    return existing_user