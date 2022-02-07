import { User } from "../interfaces/User";
import { shoeItems } from "../mocks/shoeItemMocks";
import { users } from "../mocks/usersMock";

export const resolvers = {
    Query: { 
        getAllUsers() {
            return users;
        },

        getAllShoeItems() {
            return shoeItems;
        }
    },

    Mutation: {
        createUser(parent, arg) {
            const newUser:User = {username: arg.username, password: arg.password, buyingHistory: [], role: "user"};
            users.push(newUser);
            return newUser;
        },

        signIn(parent, arg) {
            return users.find(user => user.password === arg.password && user.username === arg.username);
        }

        
    }
};

