import {Request, Response} from 'express';
import {decodeToken} from "../common/utils/decodeToken";
import {HTTP_STATUSES} from "../settings";
import {mappingSessions} from "../common/utils/mappingSessions";
import {SecurityServices} from "./securityServices";
import {SecurityQueryRepositories} from "./securityQueryRepositories";


export class SecurityController {
    constructor(protected securityServices: SecurityServices, protected securityQueryRepositories: SecurityQueryRepositories) {
    }

    async getSessions(req: Request, res: Response) {
        const token = req.cookies.refreshToken;
        const data = await decodeToken(token)

        if (!data) {
            res.status(HTTP_STATUSES.Unauthorized).send({})
            return
        }

        const {userId} = data;
        const response = await this.securityQueryRepositories.allSessionsUser(userId)

        if (HTTP_STATUSES[response.status] === HTTP_STATUSES.Success && response.data) {
            res.status(HTTP_STATUSES.Success).send(mappingSessions(response.data))
            return
        }

        res.status(HTTP_STATUSES[response.status]).send(response.errorsMessage)
        return
    }

    async deleteDeviceById(req: Request, res: Response) {
        const {deviceId} = req.params
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken || !deviceId) {
            res.status(HTTP_STATUSES.NotFound).send({})
            return
        }
        const decode = await decodeToken(refreshToken);

        if (decode) {
            const response = await this.securityServices.deleteAuthSessionWithParam(decode, deviceId)

            if (HTTP_STATUSES[response.status] === HTTP_STATUSES.NotContent) {
                res.status(HTTP_STATUSES.NotContent).send({})
                return;
            }
            res.status(HTTP_STATUSES[response.status]).send({})
            return
        }
    }

    async deleteAllDevices(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken;

        const response = await this.securityServices.deleteDevices(refreshToken)

        if (HTTP_STATUSES[response.status] === HTTP_STATUSES.NotContent) {
            res.status(HTTP_STATUSES.NotContent).send({})
            return
        }

        res.status(HTTP_STATUSES[response.status]).send({})
        return
    }
}
