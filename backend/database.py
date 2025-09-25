from sqlmodel import create_engine

DATABASE_URL = "sqlite:///./issues.db"
engine = create_engine(DATABASE_URL, echo=False)
