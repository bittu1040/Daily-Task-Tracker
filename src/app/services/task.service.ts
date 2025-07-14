import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task, TaskStatistics } from '../models/interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  // private baseUrl = 'https://backend-node-kappa.vercel.app/api/task';
  http= inject(HttpClient);

  constructor() { }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${environment.apiBaseUrl}/task/list`);
  }

  // Add a new task
  addTask(title: string): Observable<Task> {
    return this.http.post<Task>(`${environment.apiBaseUrl}/task/add`, { title });
  }

  // Mark a task as done or not done
  updateTaskStatus(taskId: string, done: boolean): Observable<{ message: string; task: Task }> {
    return this.http.patch<{ message: string; task: Task }>(`${environment.apiBaseUrl}/done/${taskId}`, { done });
  }

  // Delete a task
  deleteTask(taskId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${environment.apiBaseUrl}/task/delete/${taskId}`);
  }

  getTaskStatistics(): Observable<TaskStatistics> {
    return this.http.get<TaskStatistics>(`${environment.apiBaseUrl}/task/stats`);
  }
}
