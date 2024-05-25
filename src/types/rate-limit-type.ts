import {ObjectId} from "mongodb";

export interface IRateLimitTypeDB {
    _id?: ObjectId,
    ip: string,
    url: string,
    date: number
}