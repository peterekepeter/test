import {ChangeDetectorRef, Component, Input} from '@angular/core';
import { ActionsService } from './actions.service';
import { Task } from './Task';
import { TaskService } from './task.service';

/**
 * @title Basic checkboxes
 */
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.sass'],
})
export class AppComponent {


  get tasks(){
    return this._tasks.tasks;
  }

  constructor(private _tasks: TaskService,
    private _act: ActionsService,
    private _ref: ChangeDetectorRef){

      setInterval(() => {
        this._ref.detectChanges();
        console.log('cd');
      }, 1000);
  }

  addRootTask(){
    this._act.createRootTask();
  }

}
