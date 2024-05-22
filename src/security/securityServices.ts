import {IHeadersSession} from "../auth/types/sessions-types";
import {jwtService} from "../utils/jwt-services";

export const securityServices = {
    createAuthSessions: async (token: string, data: IHeadersSession) => {

       const a = await jwtService.decodeToken(token)

        console.log(a);

    }
}