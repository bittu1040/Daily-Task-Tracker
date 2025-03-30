import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TaskService } from '../../services/task.service';
import { ToastrService } from 'ngx-toastr';
import { Task } from '../../models/interface';





@Component({
  selector: 'app-task-list',
  imports: [MatCardModule, MatInputModule, MatButtonModule, MatIconModule, MatDividerModule, MatCheckboxModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent {

  taskService = inject(TaskService);
  toastr = inject(ToastrService);

  tasks: Task[] = [];

  ngOnInit(): void {
    this.fetchTasks();  
  }

  fetchTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
      },
      error: (error) => {
        this.toastr.error('Failed to load tasks. Please try again later.');
      },
    });
  }

  markAsDone(task: Task): void {
    this.taskService.markTaskAsDone(task._id).subscribe({
      next: (response) => {
        task.completed = true;
        this.toastr.success(response.message);
      },
      error: (error) => {
        this.toastr.error('Failed to mark task as done. Please try again later.');
      },
    });
  }

  deleteTask(task: Task): void {
    console.log(task);
    this.taskService.deleteTask(task._id).subscribe({
      next: (response) => {
        this.fetchTasks();
        this.toastr.success(response.message);
      },
      error: (error) => {
        this.toastr.error('Failed to delete task. Please try again later.');
      },
    });
  }


}
