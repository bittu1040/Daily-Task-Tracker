import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input'; 
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TaskService } from '../../services/task.service';
import { CommonService } from '../../services/common.service';

interface Task {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
}

@Component({
  selector: 'app-task-statistics',
  imports: [MatCardModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './task-statistics.component.html',
  styleUrl: './task-statistics.component.scss'
})
export class TaskStatisticsComponent {



  taskService= inject(TaskService);
  commonService= inject(CommonService);

  ngOnInit(): void {  
    this.fetchTaskStatistics();
  }

  fetchTaskStatistics(): void {
    this.taskService.getTaskStatistics().subscribe({
      next: (stats) => {
        this.commonService.totalTasks.set(stats.total);
        this.commonService.completedTasks.set(stats.done);
        this.commonService.pendingTasks.set(stats.pending);
      },
      error: (error) => {
        console.error('Failed to fetch task statistics:', error);
      },
    });
  }

}
