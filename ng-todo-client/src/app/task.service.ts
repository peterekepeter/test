import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CommandExecutor } from './commands/CommandExecutor';
import { CommandType } from './commands/CommandType';
import { ICommand } from './commands/ICommand';
import { ICreateCommand } from './commands/ICreateCommand';
import { IRenameCommand } from './commands/IRenameCommand';
import { Task } from './Task';
import { TaskSyncService } from './task-sync.service';
import { generateUniqueId } from './unique-id';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private _executor : CommandExecutor = new CommandExecutor();

  get tasks() { return this._executor.rootTasks; }

  constructor(private _taskSync: TaskSyncService) { 
    _taskSync.historyChanged.subscribe(list => {
      this._executor = new CommandExecutor();
      this._executor.execAll(list);
    });
  }

  exec(cmd: ICommand) {
    this._executor.exec(cmd);
    this._taskSync.add(cmd);
  }


}
