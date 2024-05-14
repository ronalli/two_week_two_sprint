import {ObjectId} from "mongodb";
import jwt from "jsonwebtoken";
import {IUserDBType} from "../users/types/user-types";

export const jwtService = {
    createdJWT: async (user: IUserDBType, time: string) => {
        return jwt.sign({userId: user._id}, process.env.SECRET_PASSWORD!, {expiresIn: time})
    },
    getUserIdByToken: async (token: string) => {
        try {
            const result: any = jwt.verify(token, process.env.SECRET_PASSWORD!);
            return result.userId
        } catch (e) {
            return null;
        }
    }
}