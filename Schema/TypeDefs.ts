import { gql } from "apollo-server-express";

export const typeDefs = gql`
    type User {
        id: String!
        username: String!
        password: String!
        buyingHistory: [String!]!
        role: String!
    }

    # Queries
    type Query {
        getAllUsers: [User!]!
    }

    # Mutations

    type Mutation {
        createUser(username: String!, password: String!): User!
    }

`;