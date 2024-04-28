import {ILoginBody} from "./types/login-type";
import {authMongoRepositories} from "./authMongoRepositories";
import {bcryptService} from "../utils/bcrypt-service";

export const authService = {
    login: async (data: ILoginBody): Promise<boolean | undefined> => {
        const user = await authMongoRepositories.findByLoginOrEmail(data)

        if (user) {
           return await bcryptService.checkPassword(data.password, user.hash);
        }
        return;
    }
}