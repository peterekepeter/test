import { Injectable } from '@angular/core';
import { EventEmitter } from 'protractor';
import { Observable, Subject } from 'rxjs';
import { ICommand } from './commands/ICommand';

@Injectable({
  providedIn: 'root'
})
export class TaskSyncService {

  private list: ICommand[] = [];
  historyChanged = new Subject<ICommand[]>();
  private static STORAGE_KEY = "CMD_LIST";

  add(cmd: ICommand) {
    this.list.push(cmd);
    this.storeInLocalStorage();
  }

  storeInLocalStorage() {
    const str = JSON.stringify(this.list);
    localStorage.setItem(TaskSyncService.STORAGE_KEY, str);
  }

  loadFromLocalStorage(){
    const str = localStorage.getItem(TaskSyncService.STORAGE_KEY);
    if (!str){
      return;
    }
    this.list = JSON.parse(str);
    if (this.list.length == 0){
      return 0;
    }
    this.historyChanged.next(this.list);
  }

  constructor() {
    setTimeout(() => this.loadFromLocalStorage(),0);
    
   }
}
