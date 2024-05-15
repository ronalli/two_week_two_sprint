import {add} from 'date-fns'
import {randomUUID} from "node:crypto";

import {ILoginBody} from "./types/login-types";
import {authMongoRepositories} from "./authMongoRepositories";
import {bcryptService} from "../common/adapter/bcrypt.service";
import {ResultCode} from "../types/resultCode";
import {jwtService} from "../utils/jwt-services";
import {IUserInputModelRegistration} from "./types/registration-type";
import {usersQueryRepositories} from "../users/usersQueryRepositories";
import {nodemailerService} from "../common/adapter/nodemailer.service";
import {emailExamples} from "../common/adapter/emailExamples";
import {refreshTokenCollection, usersCollection} from "../db/mongo-db";
import {IUserDBType} from "../users/types/user-types";
import {IRefreshTokenDBType} from "../types/refresh-token-type";
import jwt from "jsonwebtoken";


export const authService = {
    login: async (data: ILoginBody) => {
        const {loginOrEmail}: ILoginBody = data;
        const result = await authMongoRepositories.findByLoginOrEmail(loginOrEmail)

        // if(result.data && !result.data.emailConfirmation?.isConfirmed) {
        //     return {status: ResultCode.BadRequest, message: 'Email not confirmed', field: 'email'}
        // }

        if (result.data) {

            const success = await bcryptService.checkPassword(data.password, result.data.hash);
            if (success) {
                const accessToken = await jwtService.createdJWT(result.data, '10s')

                const refreshToken = await jwtService.createdJWT(result.data, '20s')

                return {status: ResultCode.Success, data: {accessToken, refreshToken}};
            } else {
                return {
                    status: ResultCode.Unauthorized,
                    errorMessage: 'Incorrect data entered',
                    data: null
                };
            }
        }
        return {status: result.status, errorMessage: result.errorMessage, data: null};
    },
    registration: async (data: IUserInputModelRegistration) => {
        const {login, email, password} = data;
        const result = await usersQueryRepositories.doesExistByLoginOrEmail(login, email);

        if (result.message) {
            return {
                status: result.status,
                errorMessage: {
                    message: result.message,
                    field: result.field
                }
            }
        }

        const hash = await bcryptService.generateHash(password)

        const newUser: IUserDBType = {
            login,
            email,
            hash,
            createdAt: new Date().toISOString(),
            emailConfirmation: {
                confirmationCode: randomUUID(),
                expirationDate: add(new Date(), {hours: 0, minutes: 1}),
                isConfirmed: false
            }
        }

        const successCreateUser = await authMongoRepositories.createUser(newUser);

        if (successCreateUser.data) {
            nodemailerService.sendEmail(email, newUser.emailConfirmation?.confirmationCode!, emailExamples.registrationEmail)
            // .then(() => console.log('good'))
            // .catch(e => {
            //     console.log(e)
            // })
        }


        return {
            status: ResultCode.NotContent,
        }

    },

    confirmEmail: async (code: string) => {
        const result = await usersQueryRepositories.findUserByCodeConfirmation(code);

        if (result.data?.emailConfirmation?.isConfirmed) {
            return {
                status: ResultCode.Success,
                errorMessage: {
                    message: 'Email already confirmed',
                    field: 'email'
                }
            }
        }


        if (result.data?.emailConfirmation?.expirationDate && result.data.emailConfirmation.expirationDate < new Date()) {

            return {
                status: ResultCode.BadRequest,
                errorMessage: {
                    message: 'The code is not valid',
                    field: 'email'
                }
            }
        }
        if (result.data) {
            try {
                const success = await usersCollection.findOneAndUpdate({_id: result.data._id}, {
                    $set: {
                        'emailConfirmation.isConfirmed': true,
                        'emailConfirmation.expirationDate': null,
                        'emailConfirmation.confirmationCode': null
                    }
                });
                return {
                    status: ResultCode.NotContent,
                }
            } catch (e) {
                return {
                    status: ResultCode.InternalServerError,
                    errorMessage: {
                        field: 'DB',
                        message: 'Error DB',
                    }
                }
            }

        }

        return {
            status: result.status,
            errorMessage: {
                message: result.message,
                field: result.field
            }
        }

    },
    resendCode: async (email: string) => {
        const result = await authService.checkUserCredential(email);

        if (result.data?.emailConfirmation?.isConfirmed) {
            return {
                status: ResultCode.BadRequest,
                errorMessage: {
                    message: 'Email already confirmed',
                    field: 'email'
                }
            }
        }

        if (result.data && !result.data.emailConfirmation?.isConfirmed) {
            const code = randomUUID();
            const expirationDate = add(new Date().toISOString(), {hours: 0, minutes: 1});

            const user = await usersCollection.findOneAndUpdate({_id: result.data._id}, {
                $set: {
                    'emailConfirmation.expirationDate': expirationDate,
                    'emailConfirmation.confirmationCode': code
                }
            });
            nodemailerService.sendEmail(email, code, emailExamples.registrationEmail).catch(e => console.log(e))

            return {
                status: ResultCode.NotContent,
            }
        }

        return {
            status: result.status,
            errorMessage: {
                message: result.errorMessage || 'Something went wrong',
                field: 'email'
            }
        }

    },

    logout: async (token: string) => {
        const success = await jwtService.getUserIdByToken(token);
        await refreshTokenCollection.insertOne({refreshToken: token});
        if(success) {
            return {
                status: ResultCode.NotContent,
                data: null
            }
        }

        return {
            status: ResultCode.Unauthorized,
            data: null,
            errorMessage: {
                message: 'If the JWT refreshToken inside cookie is missing, expired or incorrect',
                filed: 'token'
            }
        }
    },

    checkUserCredential: async (login: string) => {
        return await authMongoRepositories.findByEmail(login);
    },

}