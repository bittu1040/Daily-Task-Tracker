import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input'; 
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { Task } from '../../models/interface';
import { TaskService } from '../../services/task.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-add-task',
  imports: [MatCardModule, MatInputModule, MatButtonModule, MatIconModule, ReactiveFormsModule, MatDividerModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddTaskComponent {
  taskService = inject(TaskService);
  toastr = inject(ToastrService);
  commonService = inject(CommonService);
  
  taskForm: FormGroup;
  tasks: Task[] = [];

  constructor(private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      taskTitle: ['', Validators.required]
    });
  }

  addTask(): void {
    if (this.taskForm.valid) {
      this.taskService.addTask(this.taskForm.value.taskTitle).subscribe({
        next: (task) => {
          this.commonService.tasks.update((currentTasks) => [...currentTasks, task]);
          this.commonService.totalTasks.update((total) => total + 1);
          if (task.done) {
            this.commonService.completedTasks.update((completed) => completed + 1);
          } else {
            this.commonService.pendingTasks.update((pending) => pending + 1);
          }
          this.taskForm.reset();
          this.toastr.success('Task added successfully!');
        },
        error: (error) => {
          console.error('Failed to add task:', error);
          this.toastr.error('Failed to add task. Please try again later.');
        },
      });
    }
  }
}
