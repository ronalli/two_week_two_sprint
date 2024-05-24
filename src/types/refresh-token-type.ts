import {ObjectId} from "mongodb";

export interface IRefreshTokenDBType {
    _id?: ObjectId
    refreshToken: string,
}


export interface IDecodeRefreshToken {
    devicedId: string,
    iat: string,
    userId: string,
    exp: string,
}