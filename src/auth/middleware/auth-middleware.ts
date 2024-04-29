import {Response, Request, NextFunction} from 'express';
import {jwtService} from "../../utils/jwt-services";
import {HTTP_STATUSES} from "../../settings";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if(!req.headers.authorization) {
        res.status(HTTP_STATUSES.UNAUTHORIZED).send({})
        return;
    }
}