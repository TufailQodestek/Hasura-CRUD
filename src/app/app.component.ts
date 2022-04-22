import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Apollo, QueryRef } from 'apollo-angular';
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
  form!: FormGroup;
  queryRef!: QueryRef<Response>

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      assigned_by: ['', Validators.required],
      assigned_to: ['', Validators.required]
    })

    // this queryRef vairable store those data which send from the Hasura Backend 
    this.queryRef = this.apollo.watchQuery<Response>({
      query: GET_TASKS,
    })
    // and here Tasks$ vairable is store data of queryRef and it show data on screen  
    this.tasks$ = this.queryRef.valueChanges.pipe(map(result => result.data.tasks,))
  }

  // this function is use to add data into database  
  // here i define queryRef vairable in this function when we add data then this function called
  // reload queryRef vairable and we can see updated data.
  onAddTask() {
    this.apollo.mutate({
      mutation: ADD_TASK,
      variables: this.form.value

    }).subscribe(
      (data) => {
        this.queryRef.refetch();
        this.form.reset('')
        // this.form.controls.name.reset('');
        // this.form.controls.assigned_by.reset('')
        console.log('APPComponent -> onAddTask -> data ', data)
      },

      (err) => {
        console.error('AppComponent -> onAddtask -> err', err)
      }
    )
  }


}
