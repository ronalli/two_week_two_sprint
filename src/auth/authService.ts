import {ILoginBody} from "./types/login-types";
import {authMongoRepositories} from "./authMongoRepositories";
import {bcryptService} from "../utils/bcrypt-service";

export const authService = {
    login: async (data: ILoginBody) => {
        const user = await authMongoRepositories.findByLoginOrEmail(data)
        if (user) {
           const success = await bcryptService.checkPassword(data.password, user.hash);
           if(success) return user;
        }
        return;
    }
}