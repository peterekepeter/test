
export interface Task {
    id: string;
    name: string;
    completed: boolean;
    subtasks?: Task[];
    parentTask?: Task;
}
