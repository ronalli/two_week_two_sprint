import {Response, Request, NextFunction} from 'express';
import {HTTP_STATUSES} from "../settings";
import {ResultCode} from "../types/resultCode";
import {container} from "../composition-root";
import {AuthService} from "../auth/authService";

const authService = container.resolve(AuthService);

export const authJwtMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if(!req.headers.authorization) {
        res.status(HTTP_STATUSES.Unauthorized).send({})
        return
    }

    const result = await authService.checkAccessToken(req.headers.authorization)

    if(result.status === ResultCode.Success && result.data) {
        req.userId = result.data
        return next()
    }

    res.status(HTTP_STATUSES[result.status]).send(result.errorMessage)
    return
}