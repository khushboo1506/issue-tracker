from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field

class Issue(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    description: Optional[str] = None
    status: str = "open"  # open, in_progress, closed
    priority: str = "medium"  # low, medium, high
    assignee: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class IssueCreate(SQLModel):
    title: str
    description: Optional[str] = None
    status: Optional[str] = "open"
    priority: Optional[str] = "medium"
    assignee: Optional[str] = None

class IssueUpdate(SQLModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    assignee: Optional[str] = None
