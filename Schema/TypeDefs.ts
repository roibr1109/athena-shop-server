import { gql } from "apollo-server-express";

export const typeDefs = gql`
    scalar Date 

    type User {
        id: ID!
        username: String!
        password: String!
        buyingHistory: [String!]!
        role: String!
    }

    type BasicShoe {
        id: ID!
        brands: [String!]!
        model: String!
        price: Int! 
        rank: Float!
    }

    type ShoeItem {
        id: ID!
        size: Float!
        dateCreated: Date!
        datePurchased: Date!
        userRating: Float
        basicShoe: BasicShoe!
    }

    # Queries
    type Query {
        getAllUsers: [User!]!

        getAllShoeItems: [ShoeItem!]!
    }

    # Mutations

    type Mutation {
        createUser(username: String!, password: String!): User!
        
        signIn(username: String!, password: String!): User!
    }

`;