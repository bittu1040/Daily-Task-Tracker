import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input'; 
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';


interface Task {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
}


@Component({
  selector: 'app-task-list',
  imports: [MatCardModule, MatInputModule, MatButtonModule, MatIconModule, MatDividerModule, MatCheckboxModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent {

  // tasks: Task[] = [];
  tasks: Task[] = [ { id: 1, title: 'Task 1', completed: false, createdAt: new Date() } ];

  toggleTask(task: Task) {
    task.completed = !task.completed;
    this.saveTasks();
  }

  deleteTask(task: Task) {
    this.tasks = this.tasks.filter(t => t.id !== task.id);
    this.saveTasks();
  }

  saveTasks() {
  }

}
