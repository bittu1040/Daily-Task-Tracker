import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input'; 
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TaskService } from '../../services/task.service';

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

  totalTasks: number = 0;
  completedTasks: number = 0;
  pendingTasks: number = 0;

  taskService= inject(TaskService)

  ngOnInit(): void {  
    this.fetchTaskStatistics();
  }

  fetchTaskStatistics(): void {
    this.taskService.getTaskStatistics().subscribe({
      next: (stats) => {
        console.log('Task statistics fetched:', stats);
        this.totalTasks = stats.total;
        this.completedTasks = stats.done;
        this.pendingTasks = stats.pending;
      },
      error: (error) => {
        console.error('Failed to fetch task statistics:', error);
      },
    });
  }

}
