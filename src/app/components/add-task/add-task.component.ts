import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { Task } from '../../models/interface';
import { TaskService } from '../../services/task.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../services/common.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-add-task',
  imports: [MatCardModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatIconModule, ReactiveFormsModule, MatDividerModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddTaskComponent {
  taskService = inject(TaskService);
  toastr = inject(ToastrService);
  commonService = inject(CommonService);
  
  taskForm: FormGroup;
  tasks: Task[] = [];
  today: string;
  defaultDueDate: string;

  constructor(private fb: FormBuilder) {
    this.today = new Date().toISOString().split('T')[0];
    
    // Set default due date to tomorrow for easy access, but keep field empty initially
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.defaultDueDate = tomorrow.toISOString().split('T')[0];
    
    this.taskForm = this.fb.group({
      taskTitle: ['', Validators.required],
      dueDate: [''] // Empty by default - user can choose to set or leave empty
    });
  }

  addTask(): void {
    if (this.taskForm.valid) {
      this.commonService.isLoading.set(true);
      
      const taskData = {
        title: this.taskForm.value.taskTitle,
        dueDate: this.taskForm.value.dueDate || null // Send null if no due date
      };
      
      // Only pass dueDate to service if it's not null/empty
      const dueDate = taskData.dueDate ? taskData.dueDate : undefined;
      
      this.taskService.addTask(taskData.title, dueDate)
        .pipe(finalize(() => this.commonService.isLoading.set(false)))
        .subscribe({
          next: (task) => {
            this.commonService.tasks.update((currentTasks) => [...currentTasks, task]);
            this.commonService.totalTasks.update((total) => total + 1);
            if (task.done) {
              this.commonService.completedTasks.update((completed) => completed + 1);
            } else {
              this.commonService.pendingTasks.update((pending) => pending + 1);
            }
            this.taskForm.reset();
            // Keep due date empty after reset - let user decide
            this.toastr.success('Task added successfully!');
          },
          error: (error) => {
            console.error('Failed to add task:', error);
            // Error message is now handled globally by the interceptor
          },
        });
    }
  }
}
