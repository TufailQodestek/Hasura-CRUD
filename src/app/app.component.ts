import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { Response, Task, } from './util/Interface/apollo_interface';
import { GET_TASKS, ADD_TASK } from './util/graphql/queries';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {


  constructor(private apollo: Apollo, private fb: FormBuilder) { }

  title = 'hasura-course';

  tasks$: Observable<Task[]> | undefined;
  form!: FormGroup

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      assigned_by: ['', Validators.required],
      assigned_to: ['', Validators.required]
    })
    this.tasks$ = this.apollo.watchQuery<Response>({
      query: GET_TASKS,
    }).valueChanges.pipe(map(result => result.data.tasks,))
  }

  // this function is use to add data into database 

  onAddTask() {
    this.apollo.mutate({
      mutation: ADD_TASK,
      variables: this.form.value
    }).subscribe(
      (data) => { console.log('APPComponent -> onAddTask -> data ', data) },
      (err) => { console.error('AppComponent -> onAddtask -> err', err) }
    )
  }


}
