import { Component } from '@angular/core';
import { AddTaskComponent } from '../add-task/add-task.component';

@Component({
  selector: 'app-dashboard',
  imports: [AddTaskComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
