import { Component } from '@angular/core';
import { AddTaskComponent } from '../add-task/add-task.component';
import { TaskListComponent } from '../task-list/task-list.component';
import { TaskSummaryComponent } from '../task-summary/task-summary.component';

@Component({
  selector: 'app-dashboard',
  imports: [AddTaskComponent, TaskListComponent, TaskSummaryComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
