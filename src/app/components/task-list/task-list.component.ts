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
import { CommonService } from '../../services/common.service';





@Component({
  selector: 'app-task-list',
  imports: [MatCardModule, MatInputModule, MatButtonModule, MatIconModule, MatDividerModule, MatCheckboxModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent {

  taskService = inject(TaskService);
  commonService= inject(CommonService)
  toastr = inject(ToastrService);

  tasks: Task[] = [];

  ngOnInit(): void {
    this.fetchTasks();  
  }

  fetchTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (tasks:Task[]) => {
        this.commonService.tasks.set(tasks);
      },
      error: (error) => {
        this.toastr.error('Failed to load tasks. Please try again later.');
      },
    });
  }

  // Toggle task completion
  toggleTaskCompletion(task: Task): void {
    const updatedStatus = !task.done; // Use `done` instead of `completed`
    this.taskService.updateTaskStatus(task._id, updatedStatus).subscribe({
      next: (response) => {
        task.done = updatedStatus; // Update the `done` field
        this.toastr.success(response.message);
      },
      error: (error) => {
        console.error('Failed to update task status:', error);
        this.toastr.error('Failed to update task status. Please try again later.');
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
