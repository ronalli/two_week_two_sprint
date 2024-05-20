import jwt from "jsonwebtoken";
import {IUserViewModel} from "../users/types/user-types";

export const jwtService = {
    createdJWT: async (user: IUserViewModel, time: string) => {
        return jwt.sign({userId: user.id}, process.env.SECRET_PASSWORD!, {expiresIn: time})
    },
    getUserIdByToken: async (token: string) => {
        try {
            const result: any = jwt.verify(token, process.env.SECRET_PASSWORD!);
            return result.userId
        } catch (e) {
            return null
        }
    }
}