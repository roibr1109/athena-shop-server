import express from "express"
import { typeDefs } from  "./Schema/TypeDefs";
import { resolvers } from  "./Schema/Resolvers";
import * as path from 'path';
import {ApolloServer} from "apollo-server-express";
import {ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageLocalDefault} from "apollo-server-core";
const cors = require('cors');
import http from 'http';

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0"


startApolloServer();
async function startApolloServer() {
    const app = express();
    const httpServer = http.createServer(app);
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        csrfPrevention: true,
        cache: 'bounded',
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer }), ApolloServerPluginLandingPageLocalDefault({ embed: true })],
    });
    await server.start();
    app.use(cors());
    server.applyMiddleware({ app });
    await new Promise<void>((resolve) => httpServer.listen({ port: 5000 }, resolve));
    console.log(`🚀 Server ready at http://localhost:5000${server.graphqlPath}`);
};