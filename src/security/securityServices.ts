import {IHeadersSession, ISessionType} from "../auth/types/sessions-types";
import {jwtService} from "../utils/jwt-services";
import {sessionsCollection} from "../db/mongo-db";

export const securityServices = {
    createAuthSessions: async (token: string, data: IHeadersSession) => {

       const payload = await jwtService.decodeToken(token)

        if(payload && typeof payload === 'object' ) {
           const session: ISessionType = {
                ...data,
               devicedId: payload.devicedId,
               userId: payload.userId,
               exp: new Date(payload.exp! * 1000).toISOString(),
               iat: new Date(payload.iat! * 1000).toISOString(),
            };
            await sessionsCollection.insertOne({...session})
        }

    }
}