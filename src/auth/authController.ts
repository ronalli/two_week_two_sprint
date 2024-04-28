import {Request, Response} from 'express';
import {ILoginBody} from "./types/login-type";
import {authService} from "./authService";
import {HTTP_STATUSES} from "../settings";


export const authController = {
    login: async (req: Request, res: Response) => {
        const authData: ILoginBody = req.body;
        const success = await authService.login(authData);
        if(success) {
            res.status(HTTP_STATUSES.NO_CONTENT_204).send({})
            return;
        }
        res.status(HTTP_STATUSES.UNAUTHORIZED).send({})
    }
}