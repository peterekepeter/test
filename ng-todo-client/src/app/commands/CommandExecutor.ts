import { debug } from 'console';
import { Task } from "../Task";
import { CommandType } from './CommandType';
import { ICommand } from './ICommand';
import { ICreateCommand } from './ICreateCommand';
import { IDestroyCommand } from './IDestroyCommand';
import { IMoveCommand } from './IMoveCommand';
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
            case CommandType.Destroy:
                this.execDestroy(cmd as IDestroyCommand);
                break;
            case CommandType.Move:
                this.execMove(cmd as IMoveCommand);
                break;
            default:
                console.log('not supported',cmd, cmd.type);
        }
    }

    execMove(cmd: IMoveCommand) {
        const task = this.getTaskById(cmd.id);
        if (cmd.newParentId !== undefined){
            // reparent
            if (cmd.newParentId === null){
                this.addChildTask(null, task);
            } else {
                const parent = this.getTaskById(cmd.newParentId);
                this.addChildTask(parent, task);
            }
        }
        if (cmd.position !== undefined){
            // move to new position
            let targetList : Task[];
            if (task.parentTask != null && task.parentTask.subtasks != null){
                targetList = task.parentTask.subtasks;
            } else {
                targetList = this.rootTasks;
            }
            if (targetList.indexOf(task) !== -1){
                targetList.splice(targetList.indexOf(task), 1);
            }
            targetList.splice(cmd.position, 0, task);
            console.log(targetList);
        }
    }

    execToggle(cmd: IToggleCommand) {
        const task = this.getTaskById(cmd.id);
        if (!task){ return; }
        task.completed = cmd.state;
    }

    execRename(cmd: IRenameCommand) {
        const task : Task = this.getTaskById(cmd.id);
        if (!task){ return; }
        task.name = cmd.name;
    }

    execCreate(cmd: ICreateCommand) {
        const task : Task = {
            name: '',
            completed: false,
            id: cmd.id,
        }
        this.allTasks.push(task);
        if (cmd.parentId){
            this.addChildTask(this.getTaskById(cmd.parentId), task);
        } else {
            this.rootTasks.push(task);
        }
    }

    execDestroy(cmd: IDestroyCommand) {
        const task : Task = this.getTaskById(cmd.id);
        if (task && task.parentTask && task.parentTask.subtasks){
            task.parentTask.subtasks = task.parentTask.subtasks.filter(t => t !== task);
            task.parentTask = null;
        }
        this.allTasks = this.allTasks.filter(t => t !== task);
        this.rootTasks = this.rootTasks.filter(t => t !== task);
    }

    getTaskById(id: string): Task {
        return this.allTasks.find(t => t.id === id);
    }

    addChildTask(parent: Task, child: Task) {
        if (child.parentTask){
            if (child.parentTask === parent){
                return;
            }
            if (child.parentTask.subtasks){
                child.parentTask.subtasks 
                    = child.parentTask.subtasks.filter(t => t !== child);
            }
        }
        child.parentTask = parent;
        if (parent == null){
            this.rootTasks.push(child);
        } else {
            if (!parent.subtasks){
                parent.subtasks = [];
            }
            if (parent.subtasks.findIndex(t => t === child) === -1)
            {
                parent.subtasks.push(child);
            }
        }
    }

}