import {ObjectId} from "mongodb";

export interface IRefreshTokenDBType {
    _id?: ObjectId
    refreshToken: string,
}


// export interface IBlackListRefreshToken {
//     [key: string]: IRefreshTokenDBType
// }