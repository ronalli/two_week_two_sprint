import {IUserDBType, IUserInputModel, IUserViewModel} from "./types/user-types";
import {usersCollection} from "../db/mongo-db";
import {ObjectId} from "mongodb";
import {bcryptService} from "../utils/bcrypt-service";
import {ResultCode} from "../types/resultCode";

export const usersMongoRepositories = {
    createUser: async (data: IUserInputModel):Promise<IUserViewModel | undefined> => {

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
                return usersMongoRepositories._maping(result.item);
            }
            return;
        } catch (e) {
            console.error(e);
            return;
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
    deleteUser: async (id: string): Promise<boolean | undefined> => {
    try {
        const flag = await usersCollection.findOne({_id: new ObjectId(id)});
        if(!flag) {
            return;
        }
        else {
            await usersCollection.findOneAndDelete({_id: new ObjectId(id)});
            return true;
        }

    }  catch (error) {
        console.error(error);
        return;
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