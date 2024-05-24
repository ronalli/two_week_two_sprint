import {Request, Response} from 'express';
import {decodeToken} from "../common/utils/decodeToken";
import {securityServices} from "./securityServices";
import {HTTP_STATUSES} from "../settings";
import {mappingSessions} from "../common/utils/mappingSessions";

export const securityController = {
    getSessions: async (req: Request, res: Response) => {

        const token = req.cookies.refreshToken;
        const data = await decodeToken(token)

        if(!data) {
            res.status(HTTP_STATUSES.Unauthorized).send({})
            return
        }

        const response = await securityServices.getAllSessions(data)

        if(HTTP_STATUSES[response.status] === HTTP_STATUSES.Success && response.data) {
            res.status(HTTP_STATUSES.Success).send(mappingSessions(response.data))
            return
        }

        res.status(HTTP_STATUSES[response.status]).send(response.errorsMessage)
        return

    },


}