import {usersMongoRepositories} from "./usersMongoRepositories";
import {IUserInputModel} from "./types/user-types";
import {ResultCode} from "../types/resultCode";

export const usersServices = {
    createUser: async (data: IUserInputModel) => {
        return await usersMongoRepositories.createUser(data);

    },
    deleteUser: async (id:string) => {
        return await usersMongoRepositories.deleteUser(id);

    },
    findUser: async (id: string)=> {
        return await usersMongoRepositories.findUserById(id)
    }
}