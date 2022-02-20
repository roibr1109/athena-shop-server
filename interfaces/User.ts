import { gql } from "apollo-server-core";

export interface User {
    id: number
    role: string
    username: string
    password: string
    buyingHistory: string[]
};

