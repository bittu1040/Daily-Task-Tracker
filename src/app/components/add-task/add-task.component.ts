import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input'; 
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

interface Task {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
}

@Component({
  selector: 'app-add-task',
  imports: [MatCardModule, MatInputModule, MatButtonModule, MatIconModule, FormsModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddTaskComponent {
  newTaskTitle: string = '';
  tasks: Task[] = [];

  addTask() {
    if (this.newTaskTitle.trim()) {
      const newTask: Task = {
        id: Date.now(),
        title: this.newTaskTitle,
        completed: false,
        createdAt: new Date()
      };
      this.tasks.push(newTask);
      this.newTaskTitle = '';
      this.saveTasks();
    }
  }

  saveTasks() {
  }
}
