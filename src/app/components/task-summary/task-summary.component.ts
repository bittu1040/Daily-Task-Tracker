import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input'; 
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonService } from '../../services/common.service';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/interface';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-task-summary',
  imports: [MatCardModule, MatInputModule, MatButtonModule, MatIconModule, MatExpansionModule],
  templateUrl: './task-summary.component.html',
  styleUrl: './task-summary.component.scss'
})
export class TaskSummaryComponent {
  readonly commonService = inject(CommonService);
  readonly taskService = inject(TaskService);
  
  taskSummary: string = '';
  showSummary: boolean = false;
  isGeneratingSummary: boolean = false;

  generateSummary() {
    this.isGeneratingSummary = true;
    this.taskService.generateTaskSummary()
      .pipe(finalize(() => this.isGeneratingSummary = false))
      .subscribe({
        next: (response) => {
          this.taskSummary = response.summary || response.message || 'Summary generated successfully.';
          this.showSummary = true;
        },
        error: (error) => {
          console.error('Failed to generate summary:', error);
          this.taskSummary = 'Failed to generate summary. Please try again later.';
          this.showSummary = true;
        }
      });
  }
}
