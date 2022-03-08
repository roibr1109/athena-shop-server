import { User, UserToReturn } from "../interfaces/User";
import { v4 as uuidv4 } from 'uuid';
import { BasicShoe } from "../interfaces/BasicShoe";
import { ShoeItem } from "../interfaces/ShoeItem";
import { UserInputError } from "apollo-server-errors";
import { getMaxValue } from "../utils";
import { LoggerConfiguration, LoggerLevel, PolarisLogger } from '@enigmatis/polaris-logs';
import { request } from "graphql-request";
import { url } from "..";
import { BUY_SHOE, CREATE_SHOE_ITEM, GET_BASIC_SHOE, GET_BASIC_SHOES, GET_SHOES_ITEMS, UPDATE_RATE, UPDATE_USER_RATE } from "../queries/shoesQueries";
import { SIGN_IN, SIGN_UP, UPDATE_USER } from "../queries/userQueries";
const logConf: LoggerConfiguration = {
    loggerLevel: LoggerLevel.TRACE,
    writeToConsole: true
}
const logger: PolarisLogger = new PolarisLogger(logConf);

export const resolvers = {

    Query: { 
         async getAllBasicShoe(): Promise<BasicShoe[]> {
            return await request(url, GET_BASIC_SHOES).then(data => {
                return data.roi_basicShoe;
              });
         },

        async getAllShoeItems(): Promise<ShoeItem[]> {
            return await request(url, GET_SHOES_ITEMS).then(data => {
                return data.roi_shoeItem;
              });
        },

        async signIn(parent, args): Promise<UserToReturn> {
            logger.info("try to login with this details username: " + args.username + " password: " + args.password );

            return await request(url, SIGN_IN, {username: args.username,
                password: args.password}).then(data => {
                    if (!data.roi_user[0]) {
                        throw new  UserInputError("invalid username or password");
                    }

                    return data.roi_user[0]});
        },
        
        getMostPopularBrand(parent, arg): string {
            let popularityHashMap = new Map();
            
            arg.buyingHistoryItems.forEach(item => {
                const brand = item.basicShoe.brands[0];
                if (popularityHashMap.has(brand)) {
                    popularityHashMap.set(brand, popularityHashMap.get(brand) + 1);
                } else {
                    popularityHashMap.set(brand, 1);
                } 
            });
            
            return getMaxValue(popularityHashMap);
        }
    },

    Mutation: {
        async createUser(parent, args): Promise<UserToReturn> {
            logger.info("creating user with this param " + args)
            const newUser: User = {id: uuidv4(), ...args, buyingHistory: [], role: "user"};

            return await request(url, SIGN_UP, {user: newUser}).then(data => data.insert_roi_user_one)
        },

        async createShoeItem(parent, arg): Promise<ShoeItem> {
            const newShoeItem = {
                ...arg.shoeItem,
                id: uuidv4(),
            }

            return await request(url, CREATE_SHOE_ITEM, {shoeItem: newShoeItem}).then(data => 
             data.insert_roi_shoeItem_one
            )
            
        },
        
        async updateUser(parent, arg): Promise<UserToReturn> {
            return await request(url, UPDATE_USER, {id: arg.userId, shoeId: arg.itemId}).then(data => {
                if( !data.update_roi_user_by_pk ) {
                    throw new UserInputError("user not found");
                }

                return data.update_roi_user_by_pk
            }
        )

        },


        async buyShoeItem(parent, arg): Promise<ShoeItem> {
            return await request(url, BUY_SHOE, {shoeId: arg.shoeId, date: arg.datePurchased})
            .then(data => {
                return data.update_roi_shoeItem_by_pk
            })
        },

        async rateShoeItem(parent, arg): Promise<ShoeItem> {
            const basicShoe: BasicShoe = await request(url, GET_BASIC_SHOE,{ basicShoeId: arg.basicShoeId}).then(data =>
                data.roi_basicShoe_by_pk);

            if(!basicShoe) {
                throw new Error("shoe item not found");

            } 
        
            const avgSum = basicShoe.rank * basicShoe.numberOfRates + arg.rating;
            const newRank = avgSum / (basicShoe.numberOfRates + 1);
            
            await request(url, UPDATE_RATE, {id: arg.basicShoeId, newRank: newRank});
            
            return request(url, UPDATE_USER_RATE, {id: arg.shoeId, newRank: arg.rating}).then(data => {
                return data.update_roi_shoeItem_by_pk;
            });
        }
        
    }
};

