import re
from sqlalchemy import create_engine, func
from sqlalchemy.orm import sessionmaker, declarative_base, relationship
from sqlalchemy import Column, ForeignKey, Integer, String, DateTime
from environs import Env

env = Env()
env.read_env(".env")
url_database = env("URL_DB")

engine = create_engine(url_database)
Base = declarative_base()

EMAIL_REGEX = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'

def is_valid_email(email):
    return re.match(EMAIL_REGEX, email) is not None

class Users(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True)
    email = Column(String(100), unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    def __init__(self, username, email, hashed_password):
        if not is_valid_email(email):
            raise ValueError("Invalid email address {email}")
        self.username = username
        self.email = email
        self.hashed_password = hashed_password

    bookmarks = relationship('Bookmark', back_populates='users')

class Bookmark(Base):
    __tablename__ = 'bookmarks'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    url = Column(String, nullable=False)
    title = Column(String, nullable=True)
    description = Column(String)
    tags = Column(String)
    created_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    def __init__(self, user_id, url, title, description, tags):
        self.user_id = user_id
        self.url = url
        self.title = title
        self.description = description
        self.tags = tags

    users = relationship('Users', back_populates='bookmarks')

Base.metadata.create_all(engine)

Session = sessionmaker(bind=engine)