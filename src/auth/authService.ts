import {ILoginBody} from "./types/login-types";
import {authMongoRepositories} from "./authMongoRepositories";
import {bcryptService} from "../utils/bcrypt-service";
import {ResultCode} from "../types/resultCode";
import {jwtService} from "../utils/jwt-services";

export const authService = {
    login: async (data: ILoginBody) => {
        const {password, loginOrEmail }: ILoginBody = data;
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
    }
}