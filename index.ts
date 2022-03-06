import { ApolloServer } from "apollo-server-express";
import express from "express"
import { typeDefs } from  "./Schema/TypeDefs";
import { resolvers } from  "./Schema/Resolvers";
import * as path from 'path';
const cors = require('cors');
const playgroundPublicUrl =
  '/@apollographql/graphql-playground-react@1.0.0/build/';
const app = express();

export const url: string =
  "https://athena-hasura-dev.apps.oscp-dev.mamdas.iaf/v1/graphql";

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0"

const server = new ApolloServer({typeDefs, resolvers, playground:{ version: "1.0.0", cdnUrl: "http://localhost:5000" }});
app.use(cors());
server.applyMiddleware({ app });
app.use(playgroundPublicUrl, express.static(path.join(__dirname, 'public')));

app.listen({port: 5000}, () => {
    console.log("on");
})