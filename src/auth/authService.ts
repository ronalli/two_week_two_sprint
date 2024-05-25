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
import {ObjectId} from "mongodb";
import {usersMongoRepositories} from "../users/usersMongoRepositories";
import {IHeadersSession} from "./types/sessions-types";
import {securityServices} from "../security/securityServices";
import {decodeToken} from "../common/utils/decodeToken";


export const authService = {
    login: async (data: ILoginBody, dataSession: IHeadersSession) => {
        const {loginOrEmail}: ILoginBody = data;
        const result = await authMongoRepositories.findByLoginOrEmail(loginOrEmail)

        if (result.data) {

            const success = await bcryptService.checkPassword(data.password, result.data.hash);
            if (success) {

                // const user = mappingUser.inputViewModelUser(result.data);
                const devicedId = randomUUID();

                const accessToken = await jwtService.createdJWT({deviceId: devicedId, userId: String(result.data._id)}, '1h')

                const refreshToken = await jwtService.createdJWT({deviceId: devicedId, userId: String(result.data._id)}, '2h')

                await securityServices.createAuthSessions(refreshToken, dataSession)

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
        const foundedToken = await refreshTokenCollection.findOne({refreshToken: token})
        if (foundedToken) {
            return {
                status: ResultCode.Unauthorized,
                data: null,
                errorMessage: {
                    message: 'If the JWT refreshToken inside cookie is missing, expired or incorrect',
                    filed: 'token'
                }
            }
        }
        const success = await jwtService.getUserIdByToken(token);

        await refreshTokenCollection.insertOne({refreshToken: token});

        if(success) {

            const data = await decodeToken(token);

            if(data && await securityServices.deleteCurrentSession(data)) {
                return {
                    status: ResultCode.NotContent,
                    data: null
                }
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

    refreshToken: async (token: string) => {
        const validId = await jwtService.getUserIdByToken(token);

        const findedToken = await refreshTokenCollection.findOne({refreshToken: token});

        if(findedToken) {
            return {
                status: ResultCode.Unauthorized,
                data: null,
                errorMessage: {
                    message: 'If the JWT refreshToken - invalid',
                    field: 'refreshToken'
                }
            }
        }

        if(validId && !findedToken) {
            await refreshTokenCollection.insertOne({refreshToken: token})
            const user = await usersCollection.findOne({_id: new ObjectId(validId)});

            if(user) {

                const decode = await jwtService.decodeToken(token);

                console.log(decode)

                ///нужно переделать!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                console.log('нужно переделать authService 252 строка')


                const deviceId = randomUUID();


                const accessToken = await jwtService.createdJWT({deviceId, userId: String(user._id)}, '10s')
                const refreshToken = await jwtService.createdJWT({deviceId, userId: String(user._id)}, '20s')
                return {status: ResultCode.Success, data: {accessToken, refreshToken}};
            }
        }
        return {
            status: ResultCode.Unauthorized,
            data: null,
            errorMessage: {
                message: 'If the JWT refreshToken inside cookie is missing, expired or incorrect',
                field: 'refreshToken'
            }
        }

    },

    checkUserCredential: async (login: string) => {
        return await authMongoRepositories.findByEmail(login);
    },

    checkAccessToken: async (authHeader: string) => {
        const token = authHeader.split(" ");
        if(token[0] !== 'Bearer') {
            return {
                status: ResultCode.Unauthorized,
                data: null,
                errorMessage: {
                    message: 'Wrong authorization',
                    field: 'header'
                }
            }
        }

        const id = await jwtService.getUserIdByToken(token[1]);
        if(!id) {
            return {
                data: null,
                status: ResultCode.Unauthorized,
                errorMessage: {
                    message: 'Wrong access token',
                    field: 'token'
                }
            }
        }

        const payload = await usersMongoRepositories.doesExistById(id);

        if(!payload) {
            return {
                status: ResultCode.Unauthorized,
                data: null,
                errorMessage: {
                    message: 'User not found',
                    field: 'token'
                }
            }
        }

        return {
            status: ResultCode.Success,
            data: payload.id
        }


    }


}