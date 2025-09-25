import { Component, OnInit } from '@angular/core';
import { IssueService } from './issue.service';
import { Issue } from './models_issue.model';

@Component({
  selector: 'app-issue-list',
  templateUrl: './issue-list.component.html'
})
export class IssueListComponent implements OnInit {
  issues: Issue[] = [];
  page = 1;
  pageSize = 10;

  q = '';
  status = '';
  priority = '';
  assignee = '';
  sort_by = 'updated_at';
  sort_dir = 'desc';

  constructor(private svc: IssueService) {}

  ngOnInit() { this.load(); }

  load() {
    const params = {
      q: this.q || undefined,
      status: this.status || undefined,
      priority: this.priority || undefined,
      assignee: this.assignee || undefined,
      sort_by: this.sort_by,
      sort_dir: this.sort_dir,
      page: this.page,
      pageSize: this.pageSize
    };
    this.svc.list(params).subscribe(r => { this.issues = r; });
  }

  onSearch() { this.page = 1; this.load(); }
  onClearFilters() { this.q=''; this.status=''; this.priority=''; this.assignee=''; this.load(); }

  rowClicked(issue: Issue) {
    window.location.href = `/issues/${issue.id}`;
  }

  edit(issue: Issue, e: MouseEvent) {
    e.stopPropagation();
    window.location.href = `/issues/${issue.id}/edit`;
  }
}
