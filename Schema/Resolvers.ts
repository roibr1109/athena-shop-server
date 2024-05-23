import { User, UserToReturn } from "../interfaces/User";
import { v4 as uuidv4 } from 'uuid';
import { BasicShoe } from "../interfaces/BasicShoe";
import { ShoeItem } from "../interfaces/ShoeItem";
import { getMaxValue } from "../utils";
import { BUY_SHOES, CREATE_SHOE_ITEM, GET_BASIC_SHOE, GET_BASIC_SHOES, GET_SHOES_ITEMS, UPDATE_RATE, UPDATE_USER_RATE } from "../queries/shoesQueries";
import { SIGN_IN, SIGN_UP, UPDATE_USER } from "../queries/userQueries";
import apollo from "../graphql.module";
import {UserInputError} from "apollo-server-express";

export const resolvers = {

    Query: {
         async getAllBasicShoe(): Promise<BasicShoe[]> {
            return await apollo.query({
                query: GET_BASIC_SHOES
            }).then(res => {
                return res.data.athena_shop_basicShoe;
              });
         },

        async getAllShoeItems(): Promise<ShoeItem[]> {
            return await apollo.query({
                query: GET_SHOES_ITEMS})
                .then(res => {
                return res.data.athena_shop_shoeItem;
              });
        },

        async signIn(paren: any, args: any): Promise<UserToReturn> {
            console.info("try to login with this details username: " + args.username + " password: " + args.password );

            return await apollo.query<any>({
                query: SIGN_IN,
                variables: {username: args.username,
                password: args.password}}).then(res => {
                    if (!res.data.athena_shop_user[0]) {
                        throw new  UserInputError("invalid username or password");
                    }

                    return res.data.athena_shop_user[0]});
        },

        getMostPopularBrand(_, arg): string {
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
        async createUser(_, args): Promise<UserToReturn> {
            console.info("creating user with this param " + args)
            const newUser: User = {id: uuidv4(), ...args, buyingHistory: [], role: "user"};

            return await apollo.mutate<any>( {
                mutation: SIGN_UP,
                variables:{ user: newUser}
            }).then(res => res.data?.insert_athena_shop_user_one)
        },

        async createShoeItem(_, arg): Promise<ShoeItem> {
            const newShoeItem = {
                ...arg.shoeItem,
                id: uuidv4(),
            }

            return await apollo.mutate({mutation: CREATE_SHOE_ITEM,
            variables: {shoeItem: newShoeItem}})
                .then(res => res.data.insert_athena_shop_shoeItem_one
            )

        },

        async updateUser(_, arg): Promise<UserToReturn> {
            return await apollo.mutate({ mutation: UPDATE_USER,
            variables: {id: arg.userId, buyingHistory: arg.buyingHistory}})
                .then(res => {
                    if( !res.data.update_athena_shop_user_by_pk ) {
                    throw new UserInputError("user not found");
                }

                return res.data.update_athena_shop_user_by_pk
            }
        )},


        async buyShoeItems(_, arg): Promise<ShoeItem[]> {
            return await apollo.mutate({mutation: BUY_SHOES,
            variables: {shoeIds: arg.shoeIds, date: arg.datePurchased}})
            .then(res => {
                return res.data.update_athena_shop_shoeItem_many[0].returning
            })
        },

        async rateShoeItem(_, arg): Promise<ShoeItem> {
            const basicShoe: BasicShoe = await apollo.query({query: GET_BASIC_SHOE,
                variables:{ basicShoeId: arg.basicShoeId}})
                .then(res =>
                res.data.athena_shop_basicShoe_by_pk);

            if(!basicShoe) {
                throw new Error("shoe item not found");

            }

            const avgSum = basicShoe.rank * basicShoe.numberOfRates + arg.rating;
            const newRank = avgSum / (basicShoe.numberOfRates + 1);

            await apollo.mutate({mutation: UPDATE_RATE,
                variables: {id: arg.basicShoeId, newRank: newRank}});

            return apollo.mutate({mutation: UPDATE_USER_RATE,
            variables: {id: arg.shoeId, newRank: arg.rating}}).then(res => {
                return res.data.update_athena_shop_shoeItem_by_pk;
            });
        }
    }
};

