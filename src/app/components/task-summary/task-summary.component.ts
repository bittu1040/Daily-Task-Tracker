import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input'; 
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonService } from '../../services/common.service';
import { Task } from '../../models/interface';

@Component({
  selector: 'app-task-summary',
  imports: [MatCardModule, MatInputModule, MatButtonModule, MatIconModule, MatExpansionModule],
  templateUrl: './task-summary.component.html',
  styleUrl: './task-summary.component.scss'
})
export class TaskSummaryComponent implements OnInit {
  readonly commonService = inject(CommonService);
  
  taskSummary: string = '';
  showSummary: boolean = false;

  ngOnInit(): void {
    // Auto-generate summary when component loads
    setTimeout(() => this.generateSummary(), 500);
  }

  generateSummary() {
    const tasks = this.commonService.tasks();
    const completedCount = this.completedTasks;
    const pendingCount = this.pendingTasks;
    const overdueCount = this.overdueTasks;
    const dueTodayCount = this.tasksDueToday;
    const completionRate = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;
    
    let summary = `You have completed ${completedCount} out of ${tasks.length} tasks (${completionRate}% completion rate). `;
    
    if (pendingCount > 0) {
      summary += `You still have ${pendingCount} tasks pending. `;
    }
    
    if (overdueCount > 0) {
      summary += `⚠️ ${overdueCount} task${overdueCount > 1 ? 's are' : ' is'} overdue! `;
    }
    
    if (dueTodayCount > 0) {
      summary += `📅 ${dueTodayCount} task${dueTodayCount > 1 ? 's are' : ' is'} due today. `;
    }
    
    summary += this.getMotivationalMessage(completionRate, overdueCount);
    
    this.taskSummary = summary;
    this.showSummary = true;
  }

  get completedTasks(): number {
    return this.commonService.tasks().filter(task => task.done).length;
  }

  get pendingTasks(): number {
    return this.commonService.tasks().filter(task => !task.done).length;
  }

  get overdueTasks(): number {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return this.commonService.tasks().filter(task => 
      !task.done && task.dueDate && new Date(task.dueDate) < today
    ).length;
  }

  get tasksDueToday(): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return this.commonService.tasks().filter(task => {
      if (!task.dueDate || task.done) return false;
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate.getTime() === today.getTime();
    }).length;
  }

  getMotivationalMessage(completionRate: number, overdueCount: number): string {
    if (overdueCount > 0) {
      return "Focus on completing overdue tasks first to get back on track!";
    } else if (completionRate >= 80) {
      return "Excellent work! You're almost there, keep up the great momentum!";
    } else if (completionRate >= 50) {
      return "Good progress! You're halfway there, keep pushing forward!";
    } else if (completionRate > 0) {
      return "You've made a start! Focus on completing more tasks to build momentum.";
    } else {
      return "Time to get started! Break down your tasks and tackle them one by one.";
    }
  }

}
