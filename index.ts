import { ApolloServer } from "apollo-server-express";
import express from "express"
import { typeDefs } from  "./Schema/TypeDefs";
import { resolvers } from  "./Schema/Resolvers";
import * as path from 'path';
const playgroundPublicUrl =
  '/@apollographql/graphql-playground-react@1.0.0/build/';
const app = express();

const server = new ApolloServer({typeDefs, resolvers, playground:{ version: "1.0.0", cdnUrl: "http://localhost:5000" }});

server.applyMiddleware({ app });
app.use(playgroundPublicUrl, express.static(path.join(__dirname, 'public')));

app.listen({port: 5000}, () => {
    console.log("on");
})