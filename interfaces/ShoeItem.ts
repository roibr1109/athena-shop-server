import { BasicShoe } from "./BasicShoe";

export interface ShoeItem {
    id: string;
    size: number;
    dateCreated: Date | null;
    datePurchased: Date | null;
    userRating: number | null;
    basicShoe: BasicShoe;
}