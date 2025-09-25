import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Issue, IssueCreate } from './models_issue.model';

@Injectable({ providedIn: 'root' })
export class IssueService {
  private base = 'http://localhost:8000';
  constructor(private http: HttpClient) {}

  list(params: any): Observable<Issue[]> {
    let p = new HttpParams();
    Object.keys(params || {}).forEach(k => {
      if (params[k] !== undefined && params[k] !== null) {
        p = p.set(k, params[k]);
      }
    });
    return this.http.get<Issue[]>(`${this.base}/issues`, { params: p });
  }

  get(id: number) { return this.http.get<Issue>(`${this.base}/issues/${id}`); }
  create(payload: IssueCreate) { return this.http.post<Issue>(`${this.base}/issues`, payload); }
  update(id: number, payload: Partial<IssueCreate>) { return this.http.put<Issue>(`${this.base}/issues/${id}`, payload); }
}
