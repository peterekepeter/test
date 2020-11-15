import { AfterViewInit, Component, ElementRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { EventEmitter } from 'protractor';
import { ActionsService } from '../actions.service';
import { Task } from '../Task';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.sass']
})
export class TaskComponent implements AfterViewInit {

  get id() { return this.task.id; }
  get name() { return this.task.name; }
  get completed() { return this.task.completed; }
  get subtasks() { return this.task.subtasks; }
  
  @Input('task') task : Task;
  @ViewChild('inputRef', { static: false }) inputRef: ElementRef;

  _lastToggle: number;

  constructor(private _svc : ActionsService) { }
  
  ngAfterViewInit(): void {
    if (this.name == null || this.name.length === 0){
      this.inputRef.nativeElement.focus();
    }
  }

  rename(newName: string){
    this._svc.renameById(this.id, newName);
  }

  setComplete(state: boolean){
    const now = Date.now();
    if (this._lastToggle && now - this._lastToggle < 1000){
      return;
    }
    this._lastToggle = now;
    this._svc.setCompleteById(this.id, state);
  }

  nextTask(){
    this._svc.createRootTask();
  }

  deleteTask(){
    this._svc.destroyTask(this.id);
  }

  createSubtask(){
    this._svc.createSubtask(this.id);
  }

  moveToTop(){
    this._svc.moveToTop(this.id);
  }

}
