export interface Task {
    id: string;
    name: string;
    assigned_to: string;
    assigned_by: string
}

export interface Response {
    tasks: Task[];
}

