import {ObjectId} from "mongodb";
import jwt from "jsonwebtoken";
import {IUserDBType} from "../users/types/user-types";

export const jwtService = {
    createdJWT: async (user: IUserDBType) => {
        return jwt.sign({userId: user._id}, process.env.SECRET_PASSWORD!, {expiresIn: "1d"})
    },
    getUserIdByToken: async (token: string) => {
        try {
            const result: any = jwt.verify(token, process.env.SECRET_PASSWORD!);
            return new ObjectId(result.userId);
        } catch (e) {
            return null;
        }
    }
}