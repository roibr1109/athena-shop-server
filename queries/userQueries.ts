import { gql } from "graphql-request";


export const SIGN_IN = gql`query getUser($username: String, $password: String) {
    roi_user(where: {username: {_eq: $username}, password: {_eq:  $password}}) {
      id
      buyingHistory
      role
      username
    }
  }`;

export const SIGN_UP = gql`
    mutation insertUser($user: roi_user_insert_input!) {
        insert_roi_user_one(object: $user) {
            id
            username
            buyingHistory
            role
        }
    }`;

export const UPDATE_USER = gql`
mutation updateHistory($id: String!, $shoeId: jsonb) {
  update_roi_user_by_pk(pk_columns: {id: $id}, _append: {buyingHistory: $shoeId}) {
    buyingHistory
    id
    role
    username
  }
}`;


