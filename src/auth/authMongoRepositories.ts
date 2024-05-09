import {usersCollection} from "../db/mongo-db";
import {ResultCode} from "../types/resultCode";
import {IUserDBType, IUserInputModel} from "../users/types/user-types";
import {usersMongoRepositories} from "../users/usersMongoRepositories";

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
    },
    createUser: async (data: IUserDBType) => {
        try {
            const insertUser = await usersCollection.insertOne(data);
            const result = await usersMongoRepositories.findUserById(String(insertUser.insertedId))

            if(result.data) {
                return {
                    status: ResultCode.Created,
                    data: result.data,
                }
            }
            return {errorMessage: 'Error created user', status: ResultCode.NotFound, data: null}
        } catch (e) {
            return {errorMessage: 'Error DB', status: ResultCode.InternalServerError}
        }
    },
    findByEmail: async (email: string) => {
        try {
            const user = await usersCollection.findOne({email: email})
            if (user) return {
                status: ResultCode.Success,
                data: user
            };
            return {
                errorMessage: 'Error findByEmail',
                status: ResultCode.BadRequest
            }
        } catch (e) {
            return {
                errorMessage: 'Error DB',
                status: ResultCode.InternalServerError
            }
        }
    }

}