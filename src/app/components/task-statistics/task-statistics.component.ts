import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input'; 
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

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

  tasks: Task[] = [ { id: 1, title: 'Task 1', completed: false, createdAt: new Date() } ];

  get completedTasks(): number {
    return this.tasks.filter(task => task.completed).length;
  }

  get pendingTasks(): number {
    return this.tasks.filter(task => !task.completed).length;
  }

}
