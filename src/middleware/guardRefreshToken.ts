import {NextFunction, Request, Response} from "express";
import {HTTP_STATUSES} from "../settings";
import {jwtService} from "../utils/jwt-services";

export const guardRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        res.status(HTTP_STATUSES.Unauthorized).send({})
        return
    }

    const valid = await jwtService.getUserIdByToken(refreshToken)

    if(!valid) {
        res.status(HTTP_STATUSES.Unauthorized).send({})
        return
    }

    next();


}