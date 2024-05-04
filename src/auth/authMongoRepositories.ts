import {ILoginBody} from "./types/login-types";
import {usersCollection} from "../db/mongo-db";
import {ResultCode} from "../types/resultCode";

export const authMongoRepositories = {
    findByLoginOrEmail: async (loginOrEmail: string) => {
        try {
            const findUser = await usersCollection.findOne({
                $or:[{email: loginOrEmail}, {login: loginOrEmail}],
            })

            if (findUser) return {status: ResultCode.Success, data: findUser};
            return {errorMessage: 'Not found login/email', status: ResultCode.Unauthorized, data: null }

        } catch (e) {
            return {errorMessage: 'Error DB', status: ResultCode.BadRequest, data: null};
        }
    }
}