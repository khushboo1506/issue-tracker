import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IssueService } from './issue.service';
import { Issue } from './models_issue.model';

@Component({ selector: 'app-issue-detail', templateUrl: './issue-detail.component.html' })
export class IssueDetailComponent implements OnInit {
  issue?: Issue;
  constructor(private route: ActivatedRoute, private svc: IssueService) {}
  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) { this.svc.get(id).subscribe(i => this.issue = i); }
  }
}
