import { User } from "../interfaces/User";
import { users } from "../mocks/usersMock";

export const resolvers = {
    Query: { 
        getAllUsers() {
            return users;
        }
    },

    Mutation: {
        createUser(parent, arg) {
            const newUser:User = {username: arg.username, password: arg.password, buyingHistory: [], role: "user"};
            users.push(newUser);
            return newUser;
        }
    }
};

