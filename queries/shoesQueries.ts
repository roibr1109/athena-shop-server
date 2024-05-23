import {gql} from "apollo-server-express";

export const GET_BASIC_SHOES = gql`
    query getBasicShoes {
        athena_shop_basicShoe {
            id
            brands
            model
            numberOfRates
            price
            rank
        }
    }`;

export const GET_SHOES_ITEMS = gql`
    query getShoeItems {
        athena_shop_shoeItem {
            id
            size
            userRating
            datePurchased
            dateCreated
            basicShoe {
                brands
                id
                model
                numberOfRates
                price
                rank
            }
        }
    }`;

export const CREATE_SHOE_ITEM = gql`
    mutation insertShoe($shoeItem: athena_shop_shoeItem_insert_input!) {
        insert_athena_shop_shoeItem_one(object: $shoeItem) {
            id
            size
            userRating
            datePurchased
            dateCreated
            basicShoe {
                brands
                id
                model
                numberOfRates
                price
                rank
            }
    }
}`;

export const BUY_SHOES = gql`
    mutation buyShoes($shoeIds: [uuid!]!, $date: date!) {
      update_athena_shop_shoeItem_many(updates: {where: {id: {_in: $shoeIds}}, _set: {datePurchased: $date}}) {
        returning {
          basicShoe {
            brands
            id
            model
            numberOfRates
            price
            rank
          }
          dateCreated
          datePurchased
          id
          size
          userRating
        }
      }
    }`;

export const GET_BASIC_SHOE = gql` 
        query buyShoe($basicShoeId: uuid!) {
        athena_shop_basicShoe_by_pk(id: $basicShoeId) {
            brands
            id
            model
            numberOfRates
            price
            rank
        }
    }`;

export const UPDATE_RATE = gql`
    mutation rateBasicShoe($id: uuid!, $newRank: float8!) {
        update_athena_shop_basicShoe_by_pk(pk_columns: {id: $id}, _inc: {numberOfRates: 1}, _set: {rank: $newRank}) {
            id
        }
    }`;

export const UPDATE_USER_RATE = gql`
    mutation rateShoeItem($id: uuid!, $newRank: float8!) {
        update_athena_shop_shoeItem_by_pk(pk_columns: {id: $id}, _set: {userRating: $newRank}) {
            basicShoe {
                brands
                id
                model
                numberOfRates
                price
                rank
            }
            dateCreated
            basicShoeId
            datePurchased
            id
            size
            userRating
        }
    }`;


