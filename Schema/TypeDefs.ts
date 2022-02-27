import { gql } from "apollo-server-express";

export const typeDefs = gql`
    scalar Date 

    type User {
        id: ID!
        username: String!   
        buyingHistory: [String!]!
        role: String!
    }

    input UserInput {
        id: ID!
        username: String!
        buyingHistory: [String!]!
        role: String!
    }

    type BasicShoe {
        id: ID!
        brands: [String!]
        model: String!
        price: Int! 
        rank: Float
        numberOfRates: Int!
    }

    input InputBasicShoe {
        id: ID!
        brands: [String!]!
        model: String!
        price: Int! 
        rank: Float
        numberOfRates: Int!
    }

    type ShoeItem {
        id: ID!
        size: Float!
        dateCreated: Date
        datePurchased: Date
        userRating: Float
        basicShoe: BasicShoe!
    }

    input InputShoeItem{
        size: Float!
        dateCreated: Date
        datePurchased: Date
        userRating: Float
        basicShoe: InputBasicShoe
    } 

    input InputShoeItemWithAllParam{
        size: Float!
        id: ID!
        dateCreated: Date
        datePurchased: Date
        userRating: Float
        basicShoe: InputBasicShoe
    }

    # Queries
    type Query {

        getMostPopularBrand(buyingHistoryItems: [InputShoeItemWithAllParam]): String!

        getAllShoeItems: [ShoeItem!]!
        
        signIn(username: String!, password: String!): User

        getAllBasicShoe: [BasicShoe!]
    }

    # Mutations

    

    type Mutation {

        updateUser(userToUpdate: UserInput!): User!
        
        buyShoeItem(shoeId: ID!, datePurchased: Date!): ShoeItem!

        rateShoeItem(shoeId: ID!, rating: Float!): ShoeItem!

        createUser(username: String!, password: String!): User!

        createShoeItem(shoeItem: InputShoeItem!): ShoeItem!

    }

`;