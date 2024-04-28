import {usersMongoRepositories} from "./usersMongoRepositories";
import {IUserInputModel} from "./types/user-types";

export const usersServices = {
    createUser: async (data: IUserInputModel) => {
        return await usersMongoRepositories.createUser(data);
    },
    deleteUser: async (id:string): Promise<boolean | undefined> => {
        return await usersMongoRepositories.deleteUser(id);
    }

}