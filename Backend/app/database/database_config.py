from sqlmodel import SQLModel, create_engine, Session

DATABASE_URL = "sqlite:///./sqlite.db" 

engine = create_engine(DATABASE_URL, echo=True)


# Call this once at startup
def init_db():
    SQLModel.metadata.create_all(engine)
    
def get_session():
    with Session(engine) as session:
        yield session