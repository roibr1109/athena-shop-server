import { gql } from "apollo-server-core";

export interface User {
    role: string
    username: string
    password: string
    buyingHistory: string[]
};

