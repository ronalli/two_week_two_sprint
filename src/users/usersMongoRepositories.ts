import {IUserDBType, IUserInputModel, IUserViewModel} from "./types/user-types";
import {usersCollection} from "../db/mongo-db";
import {ObjectId} from "mongodb";
import {bcryptService} from "../common/adapter/bcrypt.service";
import {ResultCode} from "../types/resultCode";
import {usersQueryRepositories} from "./usersQueryRepositories";

export const usersMongoRepositories = {
    createUser: async (data: IUserInputModel) => {

        const response = await usersQueryRepositories.doesExistByLoginOrEmail(data.login, data.email)


        if (response.status === ResultCode.BadRequest) {

            return {
                errorMessage: 'User founded',
                status: ResultCode.BadRequest,
                data: null
            }
        }

        const hash = await bcryptService.generateHash(data.password);

        const newUser: IUserDBType = {
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
            const insertUser = await usersCollection.insertOne(newUser);
            const result = await usersMongoRepositories.findUserById(String(insertUser.insertedId))

            if (result.data) {
                const outViewModelUser = usersMongoRepositories._maping(result.data);
                return {
                    status: ResultCode.Created,
                    data: outViewModelUser,
                }
            }
            return {errorMessage: 'Error created user', status: ResultCode.NotFound, data: null}
        } catch (e) {
            return {errorMessage: 'Error DB', status: ResultCode.InternalServerError}
        }

    },
    findUserById: async (id: string) => {
        try {
            const foundUser = await usersCollection.findOne({_id: new ObjectId(id)})
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
    },
    deleteUser: async (id: string) => {
        try {
            const foundUser = await usersCollection.findOne({_id: new ObjectId(id)});
            if (!foundUser) {
                return {
                    errorMessage: 'Not found user',
                    status: ResultCode.NotFound,
                    data: null
                }
            }
            await usersCollection.findOneAndDelete({_id: new ObjectId(id)});
            return {
                status: ResultCode.NotContent,
                data: null
            }

        } catch (e) {
            return {errorMessage: 'Error DB', status: ResultCode.InternalServerError, data: null}
        }

    },

    doesExistById: async (id: string) => {
        const findedUser = await usersCollection.findOne({_id: new ObjectId(id)});

        if(findedUser) {
            return usersMongoRepositories._maping(findedUser);
        }
        return null;
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