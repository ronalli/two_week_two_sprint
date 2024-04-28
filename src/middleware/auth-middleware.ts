import {Response, Request, NextFunction} from 'express'
import {HTTP_STATUSES} from "../settings";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization;
    if(auth) {
        const token = Buffer.from(auth.slice(6), 'base64').toString();
        const typeEncryption = auth.slice(0, 5);
        const [name, password] = token.split(':')
        const adminData = process.env.BASIC_TOKEN as string;
        const [basicName, basicPassword] = adminData.split(":");
        if(name === basicName && password === basicPassword && typeEncryption === 'Basic') {
            next();
            return;
        } else {
            res.status(HTTP_STATUSES.UNAUTHORIZED).send({})
            return;
        }
    }
    res.status(HTTP_STATUSES.UNAUTHORIZED).send({})
    return;
}
