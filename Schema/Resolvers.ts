import { User } from "../interfaces/User";
import { BASICSHOE } from "../mocks/basicShoeMocks";
import { shoeItems } from "../mocks/shoeItemMocks";
import { users } from "../mocks/usersMock";

export const resolvers = {
    Query: { 
        getAllBasicShoe() {
            return BASICSHOE;
        },

        getAllShoeItems() {
            return shoeItems;
        },

        signIn(parent, arg) {
            console.log(arg);
            return users.find(user => user.password === arg.password && user.username === arg.username);
        },
        
        getMostPopularBrand(parent, arg) {
            let popularityHashMap = new Map();
    
            for ( let itemIndex = 0; itemIndex < arg.buyingHistoryItems.length; itemIndex++) {
              if (popularityHashMap.has(arg.buyingHistoryItems[itemIndex].basicShoe.brands[0])) {
                popularityHashMap.set(arg.buyingHistoryItems[itemIndex].basicShoe.brands[0], popularityHashMap
                    .get(arg.buyingHistoryItems[itemIndex].basicShoe.brands[0]) + 1);
              } else {
                popularityHashMap.set(arg.buyingHistoryItems[itemIndex].basicShoe.brands[0], 1);
              } 
            }
            
            let maxCount = 0, result;
            popularityHashMap.forEach((value, key) => {
              if (maxCount < value) {
                result = key;
                maxCount = value;
              }
            });
        
            return result;
        }
    },

    Mutation: {
        createUser(parent, arg) {
            const newUser:User = {id: getId(), username: arg.username, password: arg.password, buyingHistory: [], role: "user"};
            users.push(newUser);
            return newUser;
        },

        createShoeItem(parent, arg) {
            const newShoeItem = {id: "dsa",
             size: arg.shoeItem.size,
             dateCreated: arg.shoeItem.dateCreated,
             basicShoe: arg.shoeItem.basicShoe,
             datePurchased: arg.shoeItem.datePurchased,
             userRating: arg.shoeItem.userRating
            };

            shoeItems.push(newShoeItem);
            return newShoeItem;
        },
        
        updateUser(parent, arg) {
            arg.userToUpdate.id = parseInt(arg.userToUpdate.id);
            const foundIndex = users.findIndex( (user) => user.id === arg.userToUpdate.id );
            users[foundIndex] = arg.userToUpdate;
            return users[foundIndex];
        },

        buyShoeItem(parent, arg) {
            const foundIndex = shoeItems.findIndex( (shoe) => shoe.id === arg.shoeId );
            shoeItems[foundIndex].datePurchased = arg.datePurchased;
            return shoeItems[foundIndex];
        },

        rateShoeItem(parent, arg) {
            const foundIndex = shoeItems.findIndex( (shoe) => shoe.id === arg.shoeId );
            shoeItems[foundIndex].userRating = arg.rating;
            const basicShoe = shoeItems[foundIndex].basicShoe;
            const avgSum = basicShoe.rank * basicShoe.numberOfRates + arg.rating
            shoeItems[foundIndex].basicShoe.numberOfRates += 1;
            shoeItems[foundIndex].basicShoe.rank = avgSum / shoeItems[foundIndex].basicShoe.numberOfRates;
            
            return shoeItems[foundIndex];
        }
        
    }
};

function getId(): number {
    return users[users.length-1].id+1;
}

