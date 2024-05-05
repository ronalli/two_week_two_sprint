import {Request, Response} from 'express';
import {ILoginBody} from "./types/login-types";
import {authService} from "./authService";
import {HTTP_STATUSES} from "../settings";
import {usersServices} from "../users/usersServices";
import {IUserDBType} from "../users/types/user-types";
import {IMeViewModel} from "./types/me-types";

export const authController = {
    login: async (req: Request, res: Response) => {
        const authData: ILoginBody = req.body;
        const result = await authService.login(authData);
        if (result.data) {
            res.status(HTTP_STATUSES[result.status]).send({"accessToken": result.data})
            return
        }
        res.status(HTTP_STATUSES[result.status]).send({errorMessage: result.errorMessage, data: result.data})
        return
    },
    me: async (req: Request, res: Response) => {
        const userId = req.userId!;
        if(userId !== null) {
            const result = await usersServices.findUser(userId);
            if(result.data) {
                const outputResult = authController._maping(result.data);
                res.status(HTTP_STATUSES[result.status]).send(outputResult)
                return
            }
            res.status(HTTP_STATUSES[result.status]).send({errorMessage: result.errorMessage, data: result.data})
        }
        res.status(HTTP_STATUSES.BadRequest).send({errorMessage: "Something went wrong", data: null})
        return
    },
    _maping(user: IUserDBType): IMeViewModel {
        return {
            userId: String(user._id),
            email: user.email,
            login: user.login,
        }
    }
}