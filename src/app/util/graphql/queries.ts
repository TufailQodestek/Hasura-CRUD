import gql from 'graphql-tag'
import { Injectable } from '@angular/core';



export const GET_TASKS = gql`

    query MyQuery {
        tasks {
          name
          assigned_to
          assigned_by
        }
      }

     `;

export const ADD_TASK = gql`
mutation AddTask($name: String!, $assigned_by: String!,$assigned_to: String! ){
  insert_tasks(objects: {name: $name, assigned_by: $assigned_by, assigned_to: $assigned_to}) {
    returning {
      name
      assigned_to
      assigned_by
    }
  }
}
`;
