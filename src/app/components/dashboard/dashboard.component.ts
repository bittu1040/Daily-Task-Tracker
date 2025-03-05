import { Component } from '@angular/core';
import { AddTaskComponent } from '../add-task/add-task.component';
import { TaskListComponent } from '../task-list/task-list.component';
import { TaskSummaryComponent } from '../task-summary/task-summary.component';
import { TaskStatisticsComponent } from '../task-statistics/task-statistics.component';

@Component({
  selector: 'app-dashboard',
  imports: [AddTaskComponent, TaskListComponent, TaskSummaryComponent, TaskStatisticsComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
