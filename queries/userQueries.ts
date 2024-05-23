import {gql} from "apollo-server-express";


export const SIGN_IN = gql`query getUser($username: String, $password: String) {
    athena_shop_user(where: {username: {_eq: $username}, password: {_eq:  $password}}) {
      id
      buyingHistory
      role
      username
    }
  }`;

export const SIGN_UP = gql`
    mutation insertUser($user: athena_shop_user_insert_input!) {
      insert_athena_shop_user_one(object: $user) {
        id
        username
        buyingHistory
        role
      }
    }
`;

export const UPDATE_USER = gql`
    mutation updateHistory($id: uuid!, $buyingHistory: [String!]!) {
      update_athena_shop_user_by_pk(pk_columns: {id: $id}, _set: {buyingHistory: $buyingHistory}) {
        buyingHistory
        id
        role
        username
      }
    }`;


