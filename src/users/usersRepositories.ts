import {IUserDBType, IUserInputModel, IUserViewModel} from "./types/user-types";
import {ObjectId} from "mongodb";
import {bcryptService} from "../common/adapter/bcrypt.service";
import {ResultCode} from "../types/resultCode";
import {UserModel} from "./domain/user.entity";
import {UsersQueryRepositories} from "./usersQueryRepositories";
import {inject, injectable} from "inversify";

@injectable()
export class UsersRepositories {
    constructor(@inject(UsersQueryRepositories) protected usersQueryRepositories: UsersQueryRepositories) {
    }

    async createUser(data: IUserInputModel) {

        const response = await this.usersQueryRepositories.doesExistByLoginOrEmail(data.login, data.email)

        if (response.status === ResultCode.BadRequest) {

            return {
                errorMessage: 'User founded',
                status: ResultCode.BadRequest,
                data: null
            }
        }

        const hash = await bcryptService.generateHash(data.password);

        const dataUser: IUserDBType = {
            email: data.email,
            login: data.login,
            hash,
            createdAt: new Date().toISOString(),
            emailConfirmation: {
                confirmationCode: null,
                expirationDate: null,
                isConfirmed: true
            }
        }
        try {
            const user = new UserModel(dataUser);
            const response = await user.save();
            const result = await this.findUserById(String(response._id))

            if (result.data) {
                const outViewModelUser = this._maping(result.data);
                return {
                    status: ResultCode.Created,
                    data: outViewModelUser,
                }
            }
            return {errorMessage: 'Error created user', status: ResultCode.NotFound, data: null}
        } catch (e) {
            return {errorMessage: 'Error DB', status: ResultCode.InternalServerError}
        }
    }

    async findUserById(id: string) {
        try {
            const foundUser = await UserModel.findOne({_id: new ObjectId(id)})
            if (foundUser) {
                return {
                    status: ResultCode.Success,
                    data: foundUser
                }
            }
            return {errorMessage: "Not found user", status: ResultCode.NotFound}

        } catch (e) {
            return {errorMessage: 'Errors BD', status: ResultCode.InternalServerError, data: null}
        }
    }

    async deleteUser(id: string) {
        try {
            const foundUser = await UserModel.findOne({_id: new ObjectId(id)});
            if (!foundUser) {
                return {
                    errorMessage: 'Not found user',
                    status: ResultCode.NotFound,
                    data: null
                }
            }
            await UserModel.deleteOne({_id: new ObjectId(id)});
            return {
                status: ResultCode.NotContent,
                data: null
            }
        } catch (e) {
            return {errorMessage: 'Error DB', status: ResultCode.InternalServerError, data: null}
        }
    }

    async doesExistById(id: string) {
        const findedUser = await UserModel.findOne({_id: new ObjectId(id)});
        if (findedUser) {
            return this._maping(findedUser);
        }
        return null;
    }

    _maping(user: IUserDBType): IUserViewModel {
        return {
            id: String(user._id),
            createdAt: user.createdAt,
            email: user.email,
            login: user.login,
        }
    }
}