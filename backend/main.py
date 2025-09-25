from fastapi import FastAPI, HTTPException, Query
from sqlmodel import Session, select, SQLModel
from typing import Optional, List
from datetime import datetime

from database import engine
from models import Issue, IssueCreate, IssueUpdate

app = FastAPI(title="Simple Issue Tracker")

# Create DB tables
SQLModel.metadata.create_all(engine)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/issues", response_model=List[Issue])
def list_issues(
    q: Optional[str] = Query(None, description="search title contains"),
    status: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    assignee: Optional[str] = Query(None),
    sort_by: Optional[str] = Query("updated_at"),
    sort_dir: Optional[str] = Query("desc"),
    page: int = Query(1, ge=1),
    pageSize: int = Query(10, ge=1, le=100)
):
    with Session(engine) as session:
        stmt = select(Issue)
        if q:
            stmt = stmt.where(Issue.title.contains(q))
        if status:
            stmt = stmt.where(Issue.status == status)
        if priority:
            stmt = stmt.where(Issue.priority == priority)
        if assignee:
            stmt = stmt.where(Issue.assignee == assignee)

        # sorting
        sort_attr = getattr(Issue, sort_by, None)
        if sort_attr is None:
            sort_attr = Issue.updated_at
        if sort_dir == "desc":
            stmt = stmt.order_by(sort_attr.desc())
        else:
            stmt = stmt.order_by(sort_attr)

        # pagination
        offset = (page - 1) * pageSize
        stmt = stmt.offset(offset).limit(pageSize)

        results = session.exec(stmt).all()
        return results

@app.get("/issues/{issue_id}", response_model=Issue)
def get_issue(issue_id: int):
    with Session(engine) as session:
        issue = session.get(Issue, issue_id)
        if not issue:
            raise HTTPException(status_code=404, detail="Issue not found")
        return issue

@app.post("/issues", response_model=Issue, status_code=201)
def create_issue(payload: IssueCreate):
    now = datetime.utcnow()
    issue = Issue.from_orm(payload)
    issue.created_at = now
    issue.updated_at = now
    with Session(engine) as session:
        session.add(issue)
        session.commit()
        session.refresh(issue)
        return issue

@app.put("/issues/{issue_id}", response_model=Issue)
def update_issue(issue_id: int, payload: IssueUpdate):
    with Session(engine) as session:
        issue = session.get(Issue, issue_id)
        if not issue:
            raise HTTPException(status_code=404, detail="Issue not found")
        update_data = payload.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(issue, key, value)
        issue.updated_at = datetime.utcnow()
        session.add(issue)
        session.commit()
        session.refresh(issue)
        return issue
