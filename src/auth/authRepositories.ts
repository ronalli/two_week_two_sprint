import {ResultCode} from "../types/resultCode";
import {IUserDBType} from "../users/types/user-types";
import {UserModel} from "../users/domain/user.entity";
import {UsersRepositories} from "../users/usersRepositories";
import {inject, injectable} from "inversify";

@injectable()
export class AuthRepositories {
    constructor(@inject(UsersRepositories) protected usersRepositories: UsersRepositories) {
    }

    async findByLoginOrEmail(loginOrEmail: string) {
        try {
            const filter = {
                $or: [{email: loginOrEmail}, {login: loginOrEmail}],
            }

            const findUser = await UserModel.findOne(filter)

            if (findUser) return {status: ResultCode.Success, data: findUser};
            return {errorMessage: 'Not found login/email', status: ResultCode.Unauthorized, data: null}

        } catch (e) {
            return {errorMessage: 'Error DB', status: ResultCode.BadRequest, data: null};
        }
    }

    async createUser(data: IUserDBType) {
        try {
            const user = new UserModel(data);
            const response = await user.save();

            const result = await this.usersRepositories.findUserById(String(response._id))

            if (result.data) {

                return {
                    status: ResultCode.Created,
                    data: result.data,
                }
            }
            return {errorMessage: 'Error created user', status: ResultCode.NotFound, data: null}
        } catch (e) {
            return {errorMessage: 'Error DB', status: ResultCode.InternalServerError}
        }
    }

    async findByEmail(email: string){
        try {
            const user = await UserModel.findOne({email: email})
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