import {Request, Response} from 'express';
import {ILoginBody} from "./types/login-types";
import {authService} from "./authService";
import {HTTP_STATUSES} from "../settings";
import {jwtService} from "../utils/jwt-services";
import {usersServices} from "../users/usersServices";
import {IUserDBType, IUserViewModel} from "../users/types/user-types";
import {IMeViewModel} from "./types/me-types";

export const authController = {
    login: async (req: Request, res: Response) => {
        const authData: ILoginBody = req.body;
        const user = await authService.login(authData);
        if (user) {
            const token = await jwtService.createdJWT(user)
            res.status(HTTP_STATUSES.OK_200).send({"accessToken": token})
            return;
        }
        res.status(HTTP_STATUSES.UNAUTHORIZED).send({})
    },
    me: async (req: Request, res: Response) => {
        const userId = req.userId;
        if(userId !== null) {
            const user = await usersServices.findUser(userId);
            if(user) {
                const result = authController._maping(user);
                res.status(HTTP_STATUSES.OK_200).send(result)
                return;
            }
        }
    },
    _maping(user: IUserDBType): IMeViewModel {
        return {
            userId: String(user._id),
            email: user.email,
            login: user.login,
        }
    }

}