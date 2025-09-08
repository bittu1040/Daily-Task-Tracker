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
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent implements OnInit {
  private readonly taskService = inject(TaskService);
  readonly commonService = inject(CommonService);
  private readonly toastr = inject(ToastrService);

  taskFilter: string = '';
  dueDateFilter: string = '';
  sortedByDueDate: boolean = false;

  ngOnInit(): void {
    this.fetchTasks();
  }

  formatDueDate(dueDate: Date | string): string {
    const date = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    if (diffDays <= 7) return `in ${diffDays} days`;

    return date.toLocaleDateString();
  }

  isOverdue(dueDate: Date | string): boolean {
    const date = new Date(dueDate);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today
    return date < today;
  }

  isDueSoon(dueDate: Date | string): boolean {
    const date = new Date(dueDate);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 3;
  }

  fetchTasks(): void {
    this.commonService.isLoading.set(true);
    this.taskService
      .getTasks()
      .pipe(finalize(() => this.commonService.isLoading.set(false)))
      .subscribe({
        next: (tasks: Task[]) => {
          this.commonService.tasks.set(tasks);
        },
        error: (error) => {
          console.error('Error fetching tasks:', error);
          // Error message is now handled globally by the interceptor
        },
      });
  }

  get filteredTasks(): Task[] {
    const filter = this.taskFilter?.toLowerCase().trim();
    let tasks = this.commonService.tasks().filter(task =>
      task.title.toLowerCase().includes(filter)
    );

    // Apply due date filter
    if (this.dueDateFilter) {
      tasks = this.filterTasksByDueDate(tasks);
    }

    // Apply sorting
    if (this.sortedByDueDate) {
      tasks = this.sortTasksByDueDate(tasks);
    }

    return tasks;
  }

  private filterTasksByDueDate(tasks: Task[]): Task[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const endOfWeek = new Date(today);
    endOfWeek.setDate(endOfWeek.getDate() + 7);

    switch (this.dueDateFilter) {
      case 'overdue':
        return tasks.filter(task => task.dueDate && new Date(task.dueDate) < today);
      case 'today':
        return tasks.filter(task => {
          if (!task.dueDate) return false;
          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate.getTime() === today.getTime();
        });
      case 'tomorrow':
        return tasks.filter(task => {
          if (!task.dueDate) return false;
          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate.getTime() === tomorrow.getTime();
        });
      case 'thisWeek':
        return tasks.filter(task => {
          if (!task.dueDate) return false;
          const dueDate = new Date(task.dueDate);
          return dueDate >= today && dueDate <= endOfWeek;
        });
      case 'noDate':
        return tasks.filter(task => !task.dueDate);
      default:
        return tasks;
    }
  }

  private sortTasksByDueDate(tasks: Task[]): Task[] {
    return [...tasks].sort((a, b) => {
      // Tasks without due dates go to the end
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;

      // Sort by due date (earliest first)
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  }

  sortByDueDate(): void {
    this.sortedByDueDate = !this.sortedByDueDate;
  }

  editTask(task: Task): void {
    const newTitle = prompt('Edit task title:', task.title);
    if (newTitle && newTitle.trim() && newTitle !== task.title) {
      this.updateTask(task._id, newTitle.trim(), task.dueDate);
    }

    // For due date editing, you could also prompt for new due date
    const currentDueDate = task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '';
    const newDueDate = prompt('Edit due date (YYYY-MM-DD):', currentDueDate);
    if (newDueDate !== null && newDueDate !== currentDueDate) {
      this.updateTask(task._id, task.title, newDueDate || undefined);
    }
  }

  private updateTask(taskId: string, title: string, dueDate?: Date | string): void {
    this.commonService.isLoading.set(true);
    this.taskService.updateTask(taskId, title, dueDate)
      .pipe(finalize(() => this.commonService.isLoading.set(false)))
      .subscribe({
        next: (response) => {
          this.updateLocalTask(taskId, title, dueDate);
          this.toastr.success('Task updated successfully!');
        },
        error: (error) => {
          console.error('Failed to update task:', error);
        },
      });
  }

  private updateLocalTask(taskId: string, title: string, dueDate?: Date | string): void {
    this.commonService.tasks.update((tasks) =>
      tasks.map((t) => t._id === taskId ? { ...t, title, dueDate: dueDate ? new Date(dueDate) : t.dueDate } : t)
    );
  }

  toggleTaskCompletion(task: Task): void {
    const updatedStatus = !task.done;
    this.commonService.isLoading.set(true);
    this.taskService.updateTaskStatus(task._id, updatedStatus)
      .pipe(finalize(() => this.commonService.isLoading.set(false)))
      .subscribe({
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
          // Error message is now handled globally by the interceptor
        },
      });
  }

  deleteTask(task: Task): void {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    this.commonService.isLoading.set(true);
    this.taskService.deleteTask(task._id)
      .pipe(finalize(() => this.commonService.isLoading.set(false)))
      .subscribe({
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
          this.toastr.success(response.message);
        },
        error: (error) => {
          console.error('Error deleting task:', error);
          // Error message is now handled globally by the interceptor
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

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        try {
          const importedTasks = JSON.parse(e.target.result);
          this.importTasks(importedTasks);
        } catch (error) {
          this.toastr.error('Invalid JSON file format!');
          console.error('Error parsing JSON:', error);
        }
      };
      reader.readAsText(file);
    } else {
      this.toastr.error('Please select a valid JSON file!');
    }
    // Reset file input
    event.target.value = '';
  }

  importTasks(importedTasks: any[]): void {
    if (!Array.isArray(importedTasks)) {
      this.toastr.error('Invalid task format! Expected an array of tasks.');
      return;
    }

    // Validate and clean task format (handle MongoDB export format)
    const validTasks = importedTasks.filter(task =>
      task &&
      typeof task === 'object' &&
      typeof task.title === 'string' &&
      task.title.trim().length > 0
    ).map(task => ({
      title: task.title.trim(),
      dueDate: task.dueDate && task.dueDate !== "1223-12-12T00:00:00.000Z" ? task.dueDate : undefined,
      done: Boolean(task.done)
    }));

    if (validTasks.length === 0) {
      this.toastr.error('No valid tasks found in the file!');
      return;
    }

    if (validTasks.length !== importedTasks.length) {
      this.toastr.warning(`${importedTasks.length - validTasks.length} invalid tasks were skipped.`);
    }

    // Show confirmation dialog for replacing all tasks
    const existingCount = this.commonService.tasks().length;
    const confirmMessage = `Replace all ${existingCount} existing tasks with ${validTasks.length} imported tasks? This action cannot be undone!`;

    if (!confirm(confirmMessage)) {
      return;
    }

    this.replaceAllTasks(validTasks);
  }

  private importTasksIndividually(tasks: { title: string; dueDate?: string }[]): void {
    this.commonService.isLoading.set(true);
    let importedCount = 0;
    let errorCount = 0;

    const importNext = (index: number) => {
      if (index >= tasks.length) {
        this.commonService.isLoading.set(false);
        if (importedCount > 0) {
          this.toastr.success(`Successfully imported ${importedCount} task${importedCount > 1 ? 's' : ''}!`);
          this.fetchTasks(); // Refresh the task list
        }
        if (errorCount > 0) {
          this.toastr.warning(`${errorCount} task${errorCount > 1 ? 's' : ''} failed to import.`);
        }
        return;
      }

      const task = tasks[index];
      this.taskService.addTask(task.title, task.dueDate)
        .subscribe({
          next: () => {
            importedCount++;
            importNext(index + 1);
          },
          error: (error) => {
            console.error(`Error importing task "${task.title}":`, error);
            errorCount++;
            importNext(index + 1);
          }
        });
    };

    importNext(0);
  }

  private replaceAllTasks(tasks: { title: string; dueDate?: string }[]): void {
    this.commonService.isLoading.set(true);

    const existingTasks = this.commonService.tasks();

    if (existingTasks.length === 0) {
      // No existing tasks, just import new ones
      this.importTasksIndividually(tasks);
      return;
    }

    // Delete all existing tasks first, then import new ones
    const deleteNext = (index: number) => {
      if (index >= existingTasks.length) {
        // All existing tasks deleted, now import new ones
        this.importTasksIndividually(tasks);
        return;
      }

      const task = existingTasks[index];
      this.taskService.deleteTask(task._id)
        .subscribe({
          next: () => deleteNext(index + 1),
          error: (error) => {
            console.error(`Error deleting task "${task.title}":`, error);
            deleteNext(index + 1);
          }
        });
    };

    deleteNext(0);
  }
}
