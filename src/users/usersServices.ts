import {usersMongoRepositories} from "./usersMongoRepositories";
import {IUserInputModel} from "./types/user-types";
import {ResultCode} from "../types/resultCode";

export const usersServices = {
    createUser: async (data: IUserInputModel) => {
        return await usersMongoRepositories.createUser(data);
    },
    deleteUser: async (id:string): Promise<boolean | undefined> => {
        return await usersMongoRepositories.deleteUser(id);
    },
    findUser: async (id: string)=> {
        const result = await usersMongoRepositories.findUserById(id)
        if(result.item) {
            return {
                status: ResultCode.Success,
                data: result.item
            }
        }
        return {
            status: result.status,
            data: null
        }
    }
}