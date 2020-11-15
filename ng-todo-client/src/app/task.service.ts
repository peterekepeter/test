import { Injectable } from '@angular/core';
import { CommandExecutor } from './commands/CommandExecutor';
import { CommandType } from './commands/CommandType';
import { ICreateCommand } from './commands/ICreateCommand';
import { IRenameCommand } from './commands/IRenameCommand';
import { Task } from './Task';
import { generateUniquId } from './unique-id';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  executor : CommandExecutor = new CommandExecutor();

  get tasks() { return this.executor.rootTasks; }

  constructor() { 
    const create0 : ICreateCommand = { id: generateUniquId(), type:CommandType.Create };
    this.executor.exec(create0);
    const rename0 : IRenameCommand = { id: create0.id, type:CommandType.Rename, name: 'test' };
    this.executor.exec(rename0);
  }


}
