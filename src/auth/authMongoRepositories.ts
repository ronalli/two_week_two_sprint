import {ILoginBody} from "./types/login-type";
import {usersCollection} from "../db/mongo-db";
import {IUserDBType, IUserViewModel} from "../users/types/user-types";

export const authMongoRepositories = {
    findByLoginOrEmail: async (data: ILoginBody): Promise<IUserDBType | undefined> => {
        try {
            const findUser = await usersCollection.findOne({
                $or:[{email: data.loginOrEmail}, {login: data.loginOrEmail}],
            })

            if (findUser) return findUser;
            return;

        } catch (e) {
            console.error(e);
            return;
        }
    }
}