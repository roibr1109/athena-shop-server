import { gql } from "apollo-server-core";

export interface User {
    role: string
    username: string
    password: string
    buyingHistory: string[]
};

export default gql`
    type User  {
        id: ID!
        role: String
        username: string
        password: string
        buyingHistory: string[]
}
`;