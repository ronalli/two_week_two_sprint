import {Request} from "express";
import {IHeadersSession} from "../../auth/types/sessions-types";

export const mappingRequestHeaders = {
    getHeadersForCreateSession: (request: Request): IHeadersSession => {
        return {
            'deviceName': request.headers['user-agent'] || 'unknown',
            'ip': request.ip || 'unknown',
        }
    }
}