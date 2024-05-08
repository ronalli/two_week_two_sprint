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

        // if(result.data && !result.data.emailConfirmation?.isConfirmed) {
        //     return {status: ResultCode.BadRequest, message: 'Email not confirmed', field: 'email'}
        // }

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
        if(result.message) {
            return {
                status: result.status,
                message: result.message,
                field: result.field
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
        }

    },

    confirmEmail: async (code: string)=> {
        const result = await usersQueryRepositories.findUserByCodeConfirmation(code);

        if(result.data?.emailConfirmation?.isConfirmed) {
            return {
                status: ResultCode.Success,
                message: 'Email already confirmed',
                field: 'email'
            }
        }

        //Может быть бага

        if(result.data?.emailConfirmation?.expirationDate && result.data.emailConfirmation.expirationDate < new Date()) {

            console.log('бага')

            return {
                status: ResultCode.BadRequest,
                message: 'The code is not valid',
                field: 'email'
            }
        }
        if(result.data) {
            try {
                const success = await usersCollection.findOneAndUpdate({_id: result.data._id}, {$set: {'emailConfirmation.isConfirmed': true, 'emailConfirmation.expirationDate': null, 'emailConfirmation.confirmationCode': null}});
                return {
                    status: ResultCode.NotContent,
                }
            } catch (e) {
                return {message: 'Error DB', status: ResultCode.InternalServerError, field: 'DB'}
            }

        }

        return {
            status: result.status,
            message: result.message,
            field: result.field
        }

    },
    resendCode: async (email: string) => {
        const result = await authService.checkUserCredential(email);

        if(result.data?.emailConfirmation?.isConfirmed) {
            return {
                status: ResultCode.BadRequest,
                message: 'Email already confirmed',
                field: 'email'
            }
        }

        // console.log(result.data?.emailConfirmation?.expirationDate)
        //
        // console.log(new Date())

        if(result.data?.emailConfirmation?.expirationDate && result.data?.emailConfirmation?.expirationDate > new Date()) {
            return {
                status: ResultCode.Success,
            }
        }

        if(result.data) {
            const code = randomUUID();
            const expirationDate = add(new Date().toISOString(), {hours: 1, minutes: 3});

            const user = await usersCollection.findOneAndUpdate({_id: result.data._id}, {$set: {'emailConfirmation.expirationDate': expirationDate, 'emailConfirmation.confirmationCode': code}});
            nodemailerService.sendEmail(email, code, emailExamples.registrationEmail).catch(e => console.log(e))
            return {
                status: ResultCode.NotContent,
            }
        }

        return {
            status: result.status,
            message: result.message,
            field: 'email'
        }

    },

    checkUserCredential: async (login: string) => {
       return await authMongoRepositories.findByEmail(login);
    },

}