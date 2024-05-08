import {Response, Request, NextFunction} from 'express';
import {HTTP_STATUSES} from "../settings";
import {jwtService} from "../utils/jwt-services";

export const authJwtMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if(!req.headers.authorization) {
        res.status(HTTP_STATUSES.Unauthorized).send({})
        return;
    }
    const token = req.headers.authorization.split(" ")[1];
    const userId = await jwtService.getUserIdByToken(token);
    if(userId) {
        req.userId = String(userId);
        next();
        return;
    }
    res.status(HTTP_STATUSES.Unauthorized).send({})
    return
}