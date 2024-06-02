import {ResultCode} from "../types/resultCode";
import {IUserDBType} from "../users/types/user-types";
import {usersMongoRepositories} from "../users/usersMongoRepositories";
import {UserModel} from "../users/domain/user.entity";

export const authMongoRepositories = {
    findByLoginOrEmail: async (loginOrEmail: string) => {
        try {

            const filter = {
                $or:[{email: loginOrEmail}, {login: loginOrEmail}],
            }

            const findUser = await UserModel.findOne(filter)

            if (findUser) return {status: ResultCode.Success, data: findUser};
            return {errorMessage: 'Not found login/email', status: ResultCode.Unauthorized, data: null }

        } catch (e) {
            return {errorMessage: 'Error DB', status: ResultCode.BadRequest, data: null};
        }
    },
    createUser: async (data: IUserDBType) => {
        try {

            const user = new UserModel(data);
            const response = await user.save();

            const result = await usersMongoRepositories.findUserById(String(response._id))

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

}