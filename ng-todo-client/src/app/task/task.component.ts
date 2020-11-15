import { Component, Input, OnInit } from '@angular/core';
import { ActionsService } from '../actions.service';
import { Task } from '../Task';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.sass']
})
export class TaskComponent implements OnInit {

  get id() { return this.task.id; }
  get name() { return this.task.name; }
  get completed() { return this.task.completed; }
  get partiallyCompleted() { return this.task.partiallyCompleted; }
  get subtasks() { return this.task.subtasks; }
  
  @Input('task') task : Task;

  constructor(private _svc : ActionsService) { }

  ngOnInit() {
  }

  rename(newName: string){
    this._svc.renameById(this.id, newName);
  }

  setComplete(state: boolean){
    this._svc.setCompleteById(this.id, state);
  }

  nextTask(){
    this._svc.createRootTask();
  }

}
