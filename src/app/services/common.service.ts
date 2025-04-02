import { Injectable, signal } from '@angular/core';
import { Task } from '../models/interface';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  // isLoggedIn = signal(false);

  userName= signal('');
  tasks= signal<Task[]>([]);
}
