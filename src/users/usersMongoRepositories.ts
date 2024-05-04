import {IUserDBType, IUserInputModel, IUserViewModel} from "./types/user-types";
import {usersCollection} from "../db/mongo-db";
import {ObjectId} from "mongodb";
import {bcryptService} from "../utils/bcrypt-service";
import {ResultCode} from "../types/resultCode";

export const usersMongoRepositories = {
    createUser: async (data: IUserInputModel) => {

        const hash = await bcryptService.generateHash(data.password);

        const newUser: IUserDBType = {
            email: data.email,
            login: data.login,
            hash,
            createdAt: new Date().toISOString(),
        }

        try {
            const insertUser = await usersCollection.insertOne(newUser);
            const result = await usersMongoRepositories.findUserById(String(insertUser.insertedId))

            if(result.item) {
                const outViewModelUser = usersMongoRepositories._maping(result.item);
                return {
                    status: ResultCode.Created,
                    item: outViewModelUser,
                }
            }
            return {error: 'Error created user', status: ResultCode.NotFound}
        } catch (e) {
            return {error: 'Error DB', status: ResultCode.BadRequest}
        }

    },
    findUserById: async (id: string) => {
        try {
            const foundUser = await usersCollection.findOne({_id: new ObjectId(id)})
            if(foundUser) {
                return {
                    status: ResultCode.Success,
                    item: foundUser
                }
            }
            return {error: "Not found user", status: ResultCode.NotFound}

        } catch (e) {
            return {error: 'Errors BD', status: ResultCode.BadRequest}
        }
    },
    deleteUser: async (id: string) => {
    try {
        const foundUser = await usersCollection.findOne({_id: new ObjectId(id)});
        if(foundUser) {
            return {
                error: 'Not found user',
                status: ResultCode.NotFound,
            }
        }
        await usersCollection.findOneAndDelete({_id: new ObjectId(id)});
        return {
            status: ResultCode.NotContent,
            item: null
        }

    }  catch (e) {
        return {error: 'Error DB', status: ResultCode.BadRequest}
    }

    },
    _maping: (user: IUserDBType): IUserViewModel => {
        return {
            id: String(user._id),
            createdAt: user.createdAt,
            email: user.email,
            login: user.login,
        }
    }
}