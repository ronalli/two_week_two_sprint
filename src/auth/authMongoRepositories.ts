import {ILoginBody} from "./types/login-types";
import {usersCollection} from "../db/mongo-db";
import {ResultCode} from "../types/resultCode";

export const authMongoRepositories = {
    findByLoginOrEmail: async (data: ILoginBody) => {
        try {
            const findUser = await usersCollection.findOne({
                $or:[{email: data.loginOrEmail}, {login: data.loginOrEmail}],
            })

            if (findUser) return {status: ResultCode.Success,  item: findUser};
            return {error: 'Not found login/email', status: ResultCode.Unauthorized }

        } catch (e) {
            return {error: 'Error DB', status: ResultCode.BadRequest};
        }
    }
}