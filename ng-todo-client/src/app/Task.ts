
export interface Task {
    id: string;
    name: string;
    completed: boolean;
    partiallyCompleted: boolean;
    subtasks?: Task[];
    parentTask?: Task;
}
