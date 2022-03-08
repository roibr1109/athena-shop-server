import { gql } from "graphql-request";

export const GET_BASIC_SHOES = gql`
    query getBasicShoes {
        roi_basicShoe {
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
        roi_shoeItem {
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
    mutation insertShoe($shoeItem: roi_shoeItem_insert_input!) {
        insert_roi_shoeItem_one(object: $shoeItem) {
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

export const BUY_SHOE = gql`
    mutation buyShoe($shoeId: String!, $date: date!) {
        update_roi_shoeItem_by_pk(pk_columns: {id: $shoeId}, _set: {datePurchased: $date}) {
            basicShoe {
            brands
            id
            model
            numberOfRates
            price
            rank
            }
            basicShoeId
            dateCreated
            datePurchased
            id
            size
            userRating
        }
    }`;

export const GET_BASIC_SHOE = gql` 
        query buyShoe($basicShoeId: String!) {
        roi_basicShoe_by_pk(id: $basicShoeId) {
            brands
            id
            model
            numberOfRates
            price
            rank
        }
    }`;

export const UPDATE_RATE = gql`
    mutation rateBasicShoe($id: String!, $newRank: Float!) {
        update_roi_basicShoe_by_pk(pk_columns: {id: $id}, _inc: {numberOfRates: 1}, _set: {rank: $newRank}) {
            id
        }
    }`;

export const UPDATE_USER_RATE = gql`
    mutation rateShoeItem($id: String!, $newRank: float8!) {
        update_roi_shoeItem_by_pk(pk_columns: {id: $id}, _set: {userRating: $newRank}) {
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


