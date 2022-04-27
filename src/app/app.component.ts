import { Component, OnInit, ViewChild } from '@angular/core';
import { map } from 'rxjs/operators';
import { Apollo, QueryRef } from 'apollo-angular';
import { Observable } from 'rxjs';
import { Response, Task, } from './util/Interface/apollo_interface';
import { GET_TASKS, ADD_TASK, UPDATE_TASK, DELETE_TASK } from './util/graphql/queries';
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
  addform!: FormGroup;
  updateform!: FormGroup
  userid!: String;
  queryRef!: QueryRef<Response>
  ArrayData!: any
  update = false
  getid: string = ''



  async ngOnInit(): Promise<void> {
    // let str = ['a', 'b', 'c', 'd']
    // let pos = str.indexOf('c')
    // console.log(`index of c ${pos} `);
    this.addform = this.fb.group({
      name: ['', Validators.required],
      assigned_by: ['', Validators.required],
      assigned_to: ['', Validators.required]
    })

    // this queryRef vairable store those data which send from the Hasura Backend 
    this.queryRef = await this.apollo.watchQuery<Response>({
      query: GET_TASKS,
    })
    // and here Tasks$ vairable is store data of queryRef and it show data on screen  
    this.tasks$ = await this.queryRef.valueChanges.pipe(map(result => result.data.tasks,))

    console.log(`this data show from app component ${this.tasks$.subscribe(data => { this.ArrayData = data; console.log(this.ArrayData); })}`);

    /*this form is use to update data of Hasura */

    this.updateform = await this.fb.group({

      name: [''],
      assigned_by: [''],
      assigned_to: [''],
    })
  }
  // this funcion is use to get all data of particular element
  fillform(task: any) {
    this.update = !this.update
    this.getid = task.id
    this.updateform.controls['name'].setValue(task.name)
    this.updateform.controls['assigned_by'].setValue(task.assigned_by)
    this.updateform.controls['assigned_to'].setValue(task.assigned_to)

    console.log(`SHOW particular element data; ${this.getid}`);

  }

  // this function is use to add data into database  
  // here i define queryRef vairable in this function when we add data then this function called
  // reload queryRef vairable and we can see updated data.
  @ViewChild('form') form: any;
  onAddTask() {
    this.apollo.mutate({
      mutation: ADD_TASK,
      variables: this.addform.value

    }).subscribe(
      (data) => {
        this.queryRef.refetch();
        this.form.resetForm();
        // this.form.controls.name.reset('');
        // this.form.controls.assigned_by.reset('')
        console.log('APPComponent -> onAddTask -> data ', data)
      },

      (err) => {
        console.error('AppComponent -> onAddtask -> err', err)
      }
    )
  }

  // update data 

  onUpdateTask() {
    console.log('this is updated data', this.updateform.value);
    this.apollo.mutate({
      mutation: UPDATE_TASK,
      variables: { ...this.updateform.value, id: this.getid }
    }).subscribe(updatedData => {
      this.queryRef.refetch();
      this.updateform.reset('')
      console.log('APPComponent -> onUpdateTask -> updatedData ', updatedData);
    },
      (err) => {
        console.error('AppComponent -> onUpdateTask -> err', err);
      })
  }

  // this function is use to delete data form database 
  deleteData(id: string) {
    console.log('here id show from delete function', id);
    this.apollo.mutate({
      mutation: DELETE_TASK,
      variables: { id: id }
    }).subscribe(result => {
      this.queryRef.refetch()
      console.log('data show from DeleteData', result);
    },
      err => { console.error(err) })
  }

}
