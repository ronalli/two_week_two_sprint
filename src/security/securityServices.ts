import {IHeadersSession, ISessionType} from "../auth/types/sessions-types";
import {sessionsCollection} from "../db/mongo-db";
import {decodeToken} from "../common/utils/decodeToken";
import {IDecodeRefreshToken} from "../types/refresh-token-type";
import {securityQueryRepositories} from "./securityQueryRepositories";
import {ResultCode} from "../types/resultCode";
import {securityRepositories} from "./securityRepositories";

export const securityServices = {
    createAuthSessions: async (token: string, data: IHeadersSession) => {

        const payload = await decodeToken(token)

        if (payload) {
            const session: ISessionType = {
                ...data,
                ...payload
            };
            await sessionsCollection.insertOne({...session})
        }
    },

    deleteAuthSession: async (data: IDecodeRefreshToken, deviceIdParam: string) => {
        const {iat, userId, deviceId} = data;

        const res = await securityRepositories.getDevices(userId, deviceId);

        if(!res.data) {
            return {
                status: ResultCode.Forbidden,
                data: null,
                errorsMessage: [{
                    message: 'Forbidden',
                    field: 'token'
                }]
            }
        }

        if(res.status === ResultCode.Success) {
           return await securityRepositories.deleteDevice(res.data.iat)

        }

        return res;
    },

    getAllSessions: async (data: IDecodeRefreshToken) => {

        const {userId} = data;

        const response = await securityQueryRepositories.allSessionsUser(userId)

        if(response.status === ResultCode.Success) {
            return response
        }

        return response;

    }

}