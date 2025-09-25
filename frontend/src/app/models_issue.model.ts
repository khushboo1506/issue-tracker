export interface Issue {
  id: number;
  title: string;
  description?: string;
  status: string;
  priority: string;
  assignee?: string;
  created_at: string;
  updated_at: string;
}

export interface IssueCreate {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  assignee?: string;
}
