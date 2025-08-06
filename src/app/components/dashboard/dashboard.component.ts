import { Component, inject } from '@angular/core';
import { AddTaskComponent } from '../add-task/add-task.component';
import { TaskListComponent } from '../task-list/task-list.component';
import { TaskSummaryComponent } from '../task-summary/task-summary.component';
import { TaskStatisticsComponent } from '../task-statistics/task-statistics.component';
import { CommonService } from '../../services/common.service';
import { TitleCasePipe } from '@angular/common';
import { NgxLoadingModule } from "ngx-loading";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  imports: [AddTaskComponent, TaskListComponent, TaskSummaryComponent, TaskStatisticsComponent, TitleCasePipe , NgxLoadingModule, MatProgressSpinnerModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  commonService = inject(CommonService);

}
