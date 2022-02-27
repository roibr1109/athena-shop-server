import { User, UserToReturn } from "../interfaces/User";
import { BASICSHOE } from "../mocks/basicShoeMocks";
import { shoeItems } from "../mocks/shoeItemMocks";
import { usersMock } from "../mocks/usersMock";
import { v4 as uuidv4 } from 'uuid';
import { BasicShoe } from "../interfaces/BasicShoe";
import { ShoeItem } from "../interfaces/ShoeItem";
import { UserInputError } from "apollo-server-errors";
import { getClientUser, getId, getMaxValue } from "../functions";
import { createLogger, LoggerConfiguration, LoggerLevel, PolarisLogger } from '@enigmatis/polaris-logs';

const logConf: LoggerConfiguration = {
    loggerLevel: LoggerLevel.TRACE,
    writeToConsole: true
}
const logger: PolarisLogger = new PolarisLogger(logConf);

export const resolvers = {
    Query: { 
        getAllBasicShoe(): BasicShoe[] {
            return BASICSHOE;
        },

        getAllShoeItems(): ShoeItem[] {
            return shoeItems;
        },

        signIn(parent, args): UserToReturn {
            const userToReturn =  usersMock.find(user => user.password === args.password && user.username === args.username);
            logger.info("try to login with this details username: " + args.username + " password: " + args.password );

            if (!userToReturn) {
                throw new  UserInputError("invalid username or password");
            }
            
            return getClientUser(userToReturn); 
        },
        
        getMostPopularBrand(parent, arg): string {
            let popularityHashMap = new Map();
    
            for ( let itemIndex = 0; itemIndex < arg.buyingHistoryItems.length; itemIndex++) {
                const brand = arg.buyingHistoryItems[itemIndex].basicShoe.brands[0]
              if (popularityHashMap.has(brand)) {
                popularityHashMap.set(brand, popularityHashMap.get(brand) + 1);
              } else {
                popularityHashMap.set(brand, 1);
              } 
            }
            
            
            return getMaxValue(popularityHashMap);
        }
    },

    Mutation: {
        createUser(parent, args): UserToReturn {
            logger.info("creating user with this param " + args)
            const newUser: User = {id: getId(), ...args, buyingHistory: [], role: "user"};
            usersMock.push(newUser);
            return (getClientUser(newUser));
        },

        createShoeItem(parent, arg): ShoeItem {
            const newShoeItem = {
                id: uuidv4(),
                size: arg.shoeItem.size,
                dateCreated: arg.shoeItem.dateCreated,
                basicShoe: arg.shoeItem.basicShoe,
                datePurchased: arg.shoeItem.datePurchased,
                userRating: arg.shoeItem.userRating
            };

            shoeItems.push(newShoeItem);
            return newShoeItem;
        },
        
        updateUser(parent, arg): UserToReturn {
            arg.userToUpdate.id = parseInt(arg.userToUpdate.id);
            const foundIndex = usersMock.findIndex( (user) => user.id === arg.userToUpdate.id );

            if( foundIndex === -1) {
                throw new UserInputError("user not found");
            }
            usersMock[foundIndex] = arg.userToUpdate;
            return getClientUser(usersMock[foundIndex]);
        },


        buyShoeItem(parent, arg): ShoeItem {
            const foundIndex = shoeItems.findIndex( (shoe) => shoe.id === arg.shoeId );
            shoeItems[foundIndex].datePurchased = arg.datePurchased;
            return shoeItems[foundIndex];
        },

        rateShoeItem(parent, arg): ShoeItem {
            const foundIndex = shoeItems.findIndex( (shoe) => shoe.id === arg.shoeId );

            if(foundIndex === -1) {
                throw new Error("shoe item not found");
            } 
            shoeItems[foundIndex].userRating = arg.rating;
            const basicShoe = shoeItems[foundIndex].basicShoe;
            const avgSum = basicShoe.rank * basicShoe.numberOfRates + arg.rating
            shoeItems[foundIndex].basicShoe.numberOfRates++;;
            shoeItems[foundIndex].basicShoe.rank = avgSum / shoeItems[foundIndex].basicShoe.numberOfRates;
            
            return shoeItems[foundIndex];
        }
        
    }
};

