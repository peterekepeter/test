import { Injectable } from '@angular/core';
import { CommandExecutor } from './commands/CommandExecutor';
import { ICommand } from './commands/ICommand';
import { TaskSyncService } from './task-sync.service';

@Injectable({
    providedIn: 'root'
})
export class TaskService {

    private _executor: CommandExecutor = new CommandExecutor();

    get tasks() { return this._executor.rootTasks; }

    constructor(private _taskSync: TaskSyncService) {
        _taskSync.historyChanged.subscribe(list => {
            this._executor = new CommandExecutor();
            this._executor.execAll(list);
        });
        _taskSync.message_stream.subscribe(message => {
            this._executor.exec(message);
        })
    }

    exec(cmd: ICommand) {
        this._executor.exec(cmd);
        this._taskSync.add(cmd);
    }

}
