import { Component } from '@angular/core';
import { AddTaskComponent } from '../add-task/add-task.component';
import { TaskListComponent } from '../task-list/task-list.component';

@Component({
  selector: 'app-dashboard',
  imports: [AddTaskComponent, TaskListComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
