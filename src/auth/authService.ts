import {add} from 'date-fns'
import {randomUUID} from "node:crypto";

import {ILoginBody} from "./types/login-types";
import {authMongoRepositories} from "./authMongoRepositories";
import {bcryptService} from "../utils/bcrypt-service";
import {ResultCode} from "../types/resultCode";
import {jwtService} from "../utils/jwt-services";
import {IUserDB, IUserInputModelRegistration} from "./types/registration-type";
import {usersQueryRepositories} from "../users/usersQueryRepositories";
import {nodemailerService} from "../common/adapter/nodemailer.service";
import {emailExamples} from "../common/adapter/emailExamples";
import {usersCollection} from "../db/mongo-db";


export const authService = {
    login: async (data: ILoginBody) => {
        const { loginOrEmail }: ILoginBody = data;
        const result = await authMongoRepositories.findByLoginOrEmail(loginOrEmail)

        if(result.data && !result.data.emailConfirmation?.isConfirmed) {
            return {status: ResultCode.BadRequest, errorMessage: 'Email not confirmed', data: null}
        }

        if (result.data) {
           const success = await bcryptService.checkPassword(data.password, result.data.hash);
           if(success) {
               const token = await jwtService.createdJWT(result.data)
               return {status: ResultCode.Success,  data: token};
           }
           return {status: ResultCode.Unauthorized, errorMessage: 'Incorrect data entered', data: result.data};
        }
        return  {status: result.status, errorMessage: result.errorMessage, data: result.data};
    },
    registration: async (data: IUserInputModelRegistration) => {
        const {login, email, password} = data;
        const result = await usersQueryRepositories.doesExistByLoginOrEmail(login, email);
        if(result.errorMessage) {
            return {
                status: result.status,
                errorMessage: result.errorMessage,
                data: result.data
            }
        }

        const hash = await bcryptService.generateHash(password)

        const newUser: IUserDB = {
            login,
            email,
            hash,
            createdAt: new Date().toISOString(),
            emailConfirmation: {
                confirmationCode: randomUUID(),
                expirationDate: add(new Date(), {hours: 1, minutes: 3}),
                isConfirmed: false
            }
        }

        const successCreateUser = await authMongoRepositories.createUser(newUser);

        if(successCreateUser.data) {
            nodemailerService.sendEmail(email, newUser.emailConfirmation.confirmationCode, emailExamples.registrationEmail).catch(e => {
                console.log(e)
            })
        }

        return {
            status: ResultCode.NotContent,
            data: null
        }

    },

    confirmEmail: async (code: string)=> {
        const result = await usersQueryRepositories.findUserByCodeConfirmation(code);

        if(result.data?.emailConfirmation?.isConfirmed) {
            return {
                status: ResultCode.Success,
                errorMessage: 'Email already confirmed',
            }
        }

        //Может быть бага

        if(result.data?.emailConfirmation?.expirationDate && result.data.emailConfirmation.expirationDate < new Date()) {

            console.log('бага')

            return {
                status: ResultCode.BadRequest,
                errorMessage: 'The code is not valid',
            }
        }
        if(result.data) {
            try {
                const success = await usersCollection.findOneAndUpdate({_id: result.data._id}, {$set: {'emailConfirmation.isConfirmed': true, 'emailConfirmation.expirationDate': null, 'emailConfirmation.confirmationCode': null}});
                return {
                    status: ResultCode.Created,
                    data: null
                }
            } catch (e) {
                return {errorMessage: 'Error DB', status: ResultCode.InternalServerError, data: null}
            }

        }

        return {
            status: result.status,
            errorMessage: result.errorMessage
        }

    },
    resendCode: async (email: string) => {
        const result = await authService.checkUserCredential(email);

        if(result.data?.emailConfirmation?.isConfirmed) {
            return {
                status: ResultCode.Success,
                errorMessage: 'Email already confirmed',
            }
        }

        if(result.data?.emailConfirmation?.expirationDate && result.data?.emailConfirmation?.expirationDate < new Date()) {
            return {
                status: ResultCode.NotContent,
                errorMessage: 'Check your email again'
            }
        }

        if(result.data) {
            const code = randomUUID();
            const expirationDate = add(new Date().toISOString(), {hours: 1, minutes: 3});

            const user = await usersCollection.findOneAndUpdate({_id: result.data._id}, {$set: {'emailConfirmation.expirationDate': expirationDate, 'emailConfirmation.confirmationCode': code}});
            nodemailerService.sendEmail(email, code, emailExamples.registrationEmail).catch(e => console.log(e))
            return {
                status: ResultCode.NotContent,
                data: null
            }
        }

        return {
            status: result.status,
            errorMessage: result.errorMessage,
            data: result.data
        }

    },

    checkUserCredential: async (loginOrEmail: string, password?: string) => {
       return await authMongoRepositories.findByLoginOrEmail(loginOrEmail);
    },

}