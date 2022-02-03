const { gql } = require("apollo-server-express");

const typeDefs = gql`

    type User {
        username: String!
        password: String!
        buyingHistory: [String!]!
        role: String!
    }

    # Queries
    type Query {
        getUserById: User! 
    }

    # Mutations

`
module.exports = { typeDefs };