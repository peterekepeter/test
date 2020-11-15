import { Task } from "../Task";
import { CommandType } from './CommandType';
import { ICommand } from './ICommand';
import { ICreateCommand } from './ICreateCommand';
import { IRenameCommand } from './IRenameCommand';
import { IToggleCommand } from './IToggleCommand';

export class CommandExecutor
{
    rootTasks: Task[] = [];
    allTasks: Task[] = [];

    constructor()
    {
    }

    execAll(commandList: ICommand[]){
        commandList.forEach(cmd => this.exec(cmd));
    }

    exec(cmd: ICommand): void {
        switch(cmd.type){
            case CommandType.Create:
                this.execCreate(cmd as ICreateCommand);
                break;
            case CommandType.Rename:
                this.execRename(cmd as IRenameCommand);
                break;
            case CommandType.Toggle:
                this.execToggle(cmd as IToggleCommand);
                break;
            default:
                console.warn('not supported',cmd);
        }
        console.log('STATE', this.rootTasks);
    }

    execToggle(cmd: IToggleCommand) {
        const task = this.getTaskById(cmd.id);
        this.toggleSubtree(task, cmd.state);
        this.refreshParentCompletedState(task);
    }

    refreshParentCompletedState(task: Task) {
        if (!task.parentTask){
            return;
        }
        const parent = task.parentTask;
        let allComplete = true;
        let someComplete = false;
        for (const subtask of parent.subtasks){
            if (subtask.completed){
                someComplete = true;
            } else {
                allComplete = false;
            }
        }
        parent.completed = allComplete;
        parent.partiallyCompleted = someComplete;
        this.refreshParentCompletedState(parent);
    }

    toggleSubtree(task: Task, state: boolean) {
        task.completed = state;
        task.partiallyCompleted = state;
        if (!task.subtasks){
            return;
        }
        for (const subtask of task.subtasks){
            this.toggleSubtree(subtask, state);
        }
    }

    execRename(cmd: IRenameCommand) {
        const task : Task = this.getTaskById(cmd.id);
        task.name = cmd.name;
    }

    execCreate(cmd: ICreateCommand) {
        const task : Task = {
            name: '',
            completed: false,
            partiallyCompleted: false,
            id: cmd.id,
        }
        this.allTasks.push(task);
        if (cmd.parentId){
            this.addChildTask(this.getTaskById(cmd.parentId), task);
        } else {
            this.rootTasks.push(task);
        }
    }

    getTaskById(id: string): Task {
        return this.allTasks.find(t => t.id === id);
    }

    addChildTask(parent: Task, child: Task) {
        if (child.parentTask){
            if (child.parentTask.subtasks){
                child.parentTask.subtasks 
                    = child.parentTask.subtasks.filter(t => t !== child);
            }
        }
        child.parentTask = parent;
        if (!parent.subtasks){
            parent.subtasks = [];
        }
        if (parent.subtasks.findIndex(t => t === child) === -1)
        {
            parent.subtasks.push(child);
        }
    }
}