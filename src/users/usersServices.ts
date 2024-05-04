import {usersMongoRepositories} from "./usersMongoRepositories";
import {IUserInputModel} from "./types/user-types";
import {ResultCode} from "../types/resultCode";

export const usersServices = {
    createUser: async (data: IUserInputModel) => {
        const result = await usersMongoRepositories.createUser(data);

        if(result.item) {
            return {
                status: result.status,
                data: result.item
            }
        }
        return {
            status: result.status,
            data: null
        }
    },
    deleteUser: async (id:string) => {
        const result = await usersMongoRepositories.deleteUser(id);
        return {
            status: result.status,
            data: null

        }

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