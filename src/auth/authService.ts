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


export const authService = {
    login: async (data: ILoginBody) => {
        const { loginOrEmail }: ILoginBody = data;
        const result = await authMongoRepositories.findByLoginOrEmail(loginOrEmail)
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
                expirationDate: add(new Date().toISOString(), {hours: 1, minutes: 3}),
                isConfirmed: false
            }
        }

        const successCreateUser = await authMongoRepositories.createUser(newUser);

        if(successCreateUser.data) {
            nodemailerService.sendEmail(email, newUser.emailConfirmation.confirmationCode).catch(e => {
                console.log(e)
            })
        }

        return {
            status: ResultCode.Created,
            data: null
        }

    }
}