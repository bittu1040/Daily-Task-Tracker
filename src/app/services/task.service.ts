import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '../models/interface';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private baseUrl = 'https://backend-node-kappa.vercel.app/api/task';
  http= inject(HttpClient);

  constructor() { }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}/list`);
  }

  // Add a new task
  addTask(title: string): Observable<Task> {
    return this.http.post<Task>(`${this.baseUrl}/add`, { title });
  }

  // Mark a task as done or not done
  updateTaskStatus(taskId: string, done: boolean): Observable<{ message: string; task: Task }> {
    return this.http.patch<{ message: string; task: Task }>(`${this.baseUrl}/done/${taskId}`, { done });
  }

  // Delete a task
  deleteTask(taskId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/delete/${taskId}`);
  }
}
