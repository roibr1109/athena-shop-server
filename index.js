const { ApolloServer } = require("apollo-server-express");
const { typeDefs } = require("./Schema/TypeDefs");
const { resolvers } = require("./Schema/Resolvers");
const express = require('express');
const app = express();

const server = new ApolloServer({typeDefs, resolvers});

server.applyMiddleware({ app });

app.listen({port: 3000}, () => {
    console.log("Server is running on port 3000");
})