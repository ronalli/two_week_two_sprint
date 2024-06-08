import {Response, Request, NextFunction} from 'express';
import {HTTP_STATUSES} from "../settings";
import {ResultCode} from "../types/resultCode";
import {authService} from "../composition-root";

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