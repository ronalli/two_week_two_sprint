import {ILoginBody} from "./types/login-types";
import {authMongoRepositories} from "./authMongoRepositories";
import {bcryptService} from "../utils/bcrypt-service";
import {ResultCode} from "../types/resultCode";

export const authService = {
    login: async (data: ILoginBody) => {
        const result = await authMongoRepositories.findByLoginOrEmail(data)
        if (result.item) {
           const success = await bcryptService.checkPassword(data.password, result.item.hash);
           if(success) return {status: ResultCode.Success, data: result.item};
        }
        return {
            status: result.status,
            errorMessage: result.error,
            data: null
        }
    }
}