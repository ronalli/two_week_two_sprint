import {Request, Response} from 'express';
import {ILoginBody} from "./types/login-types";
import {authService} from "./authService";
import {HTTP_STATUSES} from "../settings";
import {jwtService} from "../utils/jwt-services";
import {usersServices} from "../users/usersServices";
import {IUserDBType} from "../users/types/user-types";
import {IMeViewModel} from "./types/me-types";
import {ResultCode} from "../types/resultCode";

export const authController = {
    login: async (req: Request, res: Response) => {
        const authData: ILoginBody = req.body;
        const result = await authService.login(authData);
        if (result.data) {
            const user = result.data;
            const token = await jwtService.createdJWT(user)
            res.status(HTTP_STATUSES.OK_200).send({"accessToken": token})
            return
        }
        if(result.status === ResultCode.BadRequest) {
            res.status(HTTP_STATUSES.BED_REQUEST_400).send({})
            return
        }
        res.status(HTTP_STATUSES.UNAUTHORIZED).send({})
        return
    },
    me: async (req: Request, res: Response) => {
        const userId = req.userId;
        if(userId !== null) {
            const result = await usersServices.findUser(userId);
            if(result.data) {
                const outputResult = authController._maping(result.data);
                res.status(HTTP_STATUSES.OK_200).send(outputResult)
                return
            }
            if(result.status === ResultCode.NotFound) {
                res.status(HTTP_STATUSES.NOT_FOUND_404).send({})
                return
            }
        }
        res.status(HTTP_STATUSES.BED_REQUEST_400).send({})
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