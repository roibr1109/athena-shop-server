import { User, UserToReturn } from "./interfaces/User";
import { usersMock } from "./mocks/usersMock";

export function getId(): number {
    return usersMock[usersMock.length-1].id+1;
}

export function getClientUser(user: User): UserToReturn {
    const {id, username, buyingHistory, role} = user;
    const userToReturn: UserToReturn = {id, username, buyingHistory, role};
    return userToReturn;
}

export function getMaxValue(popularityHashMap: Map<any, any>): string {
    let maxCount = 0, result;
    popularityHashMap.forEach((value, key) => {
        if (maxCount < value) {
            result = key;
            maxCount = value;
            }
        });
        
    return result;
}