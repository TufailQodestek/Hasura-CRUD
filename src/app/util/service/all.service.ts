import { Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import { ADD_TASK, GET_TASKS } from "../graphql/queries";
import { UpdateComponent } from "src/app/update/update.component";
@Injectable({
    providedIn: 'root'
})

export class AllServices {
    id: any
    constructor(private apollo: Apollo) { }

    getTask() {
        this.apollo.watchQuery({
            query: GET_TASKS,
        })
    }

    getId(id: any) {
        console.log('this id show form allservice -> updateTask', id);
        this.id = id
        return id

    }
}