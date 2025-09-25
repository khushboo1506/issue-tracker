import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IssueService } from './issue.service';
import { IssueCreate } from './models_issue.model';

@Component({ selector: 'app-issue-form', templateUrl: './issue-form.component.html' })
export class IssueFormComponent implements OnInit {
  model: IssueCreate = { title: '', description: '', status: 'open', priority: 'medium', assignee: '' };
  id?: number;
  constructor(private svc: IssueService, private router: Router, private route: ActivatedRoute) {}
  ngOnInit() {
    const idStr = this.route.snapshot.paramMap.get('id');
    if (idStr) {
      this.id = Number(idStr);
      this.svc.get(this.id).subscribe(i => this.model = i as any);
    }
  }
  save() {
    if (this.id) {
      this.svc.update(this.id, this.model).subscribe(() => this.router.navigate(['/']));
    } else {
      this.svc.create(this.model).subscribe(() => this.router.navigate(['/']));
    }
  }
}
