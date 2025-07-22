import { Component, OnInit, inject } from '@angular/core';
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
import { finalize } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ngxLoadingAnimationTypes, NgxLoadingModule } from 'ngx-loading';

@Component({
  selector: 'app-task-list',
  imports: [
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatCheckboxModule,
    FormsModule,
    NgxLoadingModule
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent implements OnInit {
  private readonly taskService = inject(TaskService);
  readonly commonService = inject(CommonService);
  private readonly toastr = inject(ToastrService);

  isLoading = false;
  taskFilter: string = '';
  loadingAnimationTypes = ngxLoadingAnimationTypes.cubeGrid;

  ngOnInit(): void {
    this.fetchTasks();
  }

  fetchTasks(): void {
    this.isLoading = true;
    this.taskService
      .getTasks()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (tasks: Task[]) => {
          this.commonService.tasks.set(tasks);
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error fetching tasks:', error);
          this.toastr.error('Failed to load tasks. Please try again later.');
        },
      });
  }

  get filteredTasks(): Task[] {
    const filter = this.taskFilter?.toLowerCase().trim();
    return this.commonService.tasks().filter(task =>
      task.title.toLowerCase().includes(filter)
    );
  }

  toggleTaskCompletion(task: Task): void {
    const updatedStatus = !task.done;
    this.taskService.updateTaskStatus(task._id, updatedStatus).subscribe({
      next: (response) => {
        // Update the local task state
        this.updateLocalTaskStatus(task._id, updatedStatus);
        if (updatedStatus) {
          this.commonService.completedTasks.update(
            (completed) => completed + 1
          );
          this.commonService.pendingTasks.update((pending) => pending - 1);
        } else {
          this.commonService.completedTasks.update(
            (completed) => completed - 1
          );
          this.commonService.pendingTasks.update((pending) => pending + 1);
        }
        this.toastr.success(response.message);
      },
      error: (error) => {
        console.error('Failed to update task status:', error);
        this.toastr.error(
          'Failed to update task status. Please try again later.'
        );
      },
    });
  }

  deleteTask(task: Task): void {
    this.isLoading = true;
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    this.taskService.deleteTask(task._id).subscribe({
      next: (response) => {
        // Remove task from local state instead of refetching all tasks
        this.removeTaskFromLocalState(task._id);
        this.commonService.totalTasks.update((total) => total - 1);
        if (task.done) {
          this.commonService.completedTasks.update(
            (completed) => completed - 1
          );
        } else {
          this.commonService.pendingTasks.update((pending) => pending - 1);
        }
        this.isLoading = false;
        this.toastr.success(response.message);
      },
      error: (error) => {
        console.error('Error deleting task:', error);
        this.isLoading = false;
        this.toastr.error('Failed to delete task. Please try again later.');
      },
    });
  }

  private updateLocalTaskStatus(taskId: string, status: boolean): void {
    this.commonService.tasks.update((tasks) =>
      tasks.map((t) => (t._id === taskId ? { ...t, done: status } : t))
    );
  }

  private removeTaskFromLocalState(taskId: string): void {
    this.commonService.tasks.update((tasks) =>
      tasks.filter((t) => t._id !== taskId)
    );
  }

  exportTasks() {
    const tasks = this.commonService.tasks();
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(tasks));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute('download', 'tasks.json');
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }
}
