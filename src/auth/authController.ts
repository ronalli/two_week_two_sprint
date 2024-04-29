import {Request, Response} from 'express';
import {ILoginBody} from "./types/login-types";
import {authService} from "./authService";
import {HTTP_STATUSES} from "../settings";
import jwt from 'jsonwebtoken';
import {jwtService} from "../utils/jwt-services";


export const authController = {
    login: async (req: Request, res: Response) => {
        const authData: ILoginBody = req.body;
        const user = await authService.login(authData);
        if (user) {
            const token = await jwtService.createdJWT(user)
            res.status(HTTP_STATUSES.OK_200).send({"access_token": token})
            return;
        }
        res.status(HTTP_STATUSES.UNAUTHORIZED).send({})
    },
    me: async (req: Request, res: Response) => {

    }

}