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
  addTask(title: string, dueDate?: string): Observable<Task> {
    const payload: any = { title };
    if (dueDate) {
      payload.dueDate = dueDate;
    }
    return this.http.post<Task>(`${environment.apiBaseUrl}/task/add`, payload);
  }

  // Mark a task as done or not done
  updateTaskStatus(taskId: string, done: boolean): Observable<{ message: string; task: Task }> {
    return this.http.patch<{ message: string; task: Task }>(`${environment.apiBaseUrl}/task/done/${taskId}`, { done });
  }

  // Update task title and/or due date
  updateTask(taskId: string, title?: string, dueDate?: Date | string): Observable<{ message: string; task: Task }> {
    const payload: any = {};
    if (title) payload.title = title;
    if (dueDate) payload.dueDate = dueDate;
    return this.http.patch<{ message: string; task: Task }>(`${environment.apiBaseUrl}/task/update/${taskId}`, payload);
  }

  // Delete a task
  deleteTask(taskId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${environment.apiBaseUrl}/task/delete/${taskId}`);
  }

  getTaskStatistics(): Observable<TaskStatistics> {
    return this.http.get<TaskStatistics>(`${environment.apiBaseUrl}/task/stats`);
  }

  // Bulk import tasks
  importTasks(tasks: { title: string; dueDate?: string }[]): Observable<{ message: string; imported: number }> {
    return this.http.post<{ message: string; imported: number }>(`${environment.apiBaseUrl}/task/import`, { tasks });
  }

  // Export tasks as JSON file
  exportTasks(): Observable<Blob> {
    return this.http.get(`${environment.apiBaseUrl}/task/export`, { 
      responseType: 'blob'
    });
  }
}
