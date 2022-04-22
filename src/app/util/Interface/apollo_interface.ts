export interface Task {

    name: string;
    assigned_to: string;
    assigned_by: string
}

export interface Response {
    tasks: Task[];
}

// export interface formgroup{
//     taskName:String;
//     assignedBy:String;
//     assignedTo:String;
// }