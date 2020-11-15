import { Injectable } from '@angular/core';
import { CommandType } from './commands/CommandType';
import { ICommand } from './commands/ICommand';
import { ICreateCommand } from './commands/ICreateCommand';
import { IRenameCommand } from './commands/IRenameCommand';
import { IToggleCommand } from './commands/IToggleCommand';
import { TaskService } from './task.service';
import { generateUniquId } from './unique-id';

@Injectable({
  providedIn: 'root'
})
export class ActionsService {

  constructor(private _tasks: TaskService) { }

  setCompleteById(id: any, state: boolean) {
    const cmd : IToggleCommand = {
      type: CommandType.Toggle,
      id,
      state
    }
    this._submit(cmd);
  }

  renameById(id: string, newName: string) {
    const cmd: IRenameCommand = {
      type: CommandType.Rename,
      id,
      name: newName
    }
    this._submit(cmd);
  }

  createRootTask() {
    const cmd: ICreateCommand = {
      type: CommandType.Create,
      id: generateUniquId()
    }
    this._submit(cmd);
  }

  private _submit(cmd: ICommand) {
    this._tasks.executor.exec(cmd);
  }
  
}
