import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { Task } from '../../models/interface';
import { TaskService } from '../../services/task.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-add-task',
  imports: [
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatDividerModule,
  ],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss',
})
export class AddTaskComponent {
  taskService = inject(TaskService);
  toastr = inject(ToastrService);
  commonService = inject(CommonService);

  newTaskTitle: string = '';
  tasks: Task[] = [];

  addTask(): void {
    if (this.newTaskTitle.trim()) {
      this.taskService.addTask(this.newTaskTitle).subscribe({
        next: (task) => {
          this.newTaskTitle = '';
          this.commonService.tasks.update((currentTasks) => [
            task,
            ...currentTasks,
          ]);
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
