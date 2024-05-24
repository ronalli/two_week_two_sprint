import {IHeadersSession, ISessionType} from "../auth/types/sessions-types";
import {sessionsCollection} from "../db/mongo-db";
import {decodeToken} from "../common/utils/decodeToken";
import {IDecodeRefreshToken} from "../types/refresh-token-type";
import {securityQueryRepositories} from "./securityQueryRepositories";
import {ResultCode} from "../types/resultCode";

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

    deleteAuthSession: async (data: Omit<ISessionType, 'ip' | 'deviceName' | 'exp'>) => {
        const {iat, userId, devicedId} = data;
        await sessionsCollection.findOneAndDelete({iat: iat})
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