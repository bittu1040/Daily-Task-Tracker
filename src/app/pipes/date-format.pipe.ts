import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat',
  pure: true, // default — performance optimization
  standalone: true
})
export class DateFormatPipe implements PipeTransform {

  transform(dueDate: Date | string): string {
    const date = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    if (diffDays <= 7) return `in ${diffDays} days`;

    return date.toLocaleDateString();
  }

}
