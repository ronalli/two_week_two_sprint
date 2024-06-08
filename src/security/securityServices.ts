import {IHeadersSession, ISessionType} from "../auth/types/sessions-types";
import {decodeToken} from "../common/utils/decodeToken";
import {IDecodeRefreshToken} from "../types/refresh-token-type";
import {SecurityQueryRepositories} from "./securityQueryRepositories";
import {ResultCode} from "../types/resultCode";
import {DeviceModel} from "./domain/device.entity";
import {SecurityRepositories} from "./securityRepositories";

export class SecurityServices {

    constructor(protected securityRepositories: SecurityRepositories, protected securityQueryRepositories: SecurityQueryRepositories) {
    }

    async createAuthSessions(token: string, data: IHeadersSession) {

        const payload = await decodeToken(token)

        if (payload) {
            const session: ISessionType = {
                ...data,
                ...payload
            };

            const device = new DeviceModel(session)

            await device.save()
        }
    }

    async deleteAuthSessionWithParam(data: IDecodeRefreshToken, deviceIdParam: string) {
        const {iat, userId, deviceId} = data;

        const res = await this.securityRepositories.getDevice(deviceIdParam);

        if (res.errorsMessage) {
            return res;
        }

        if (!res.data) {
            return {
                status: ResultCode.NotFound,
                data: null
            }
        }

        if (res.data.userId !== userId) {
            return {
                status: ResultCode.Forbidden,
                data: null,
                errorsMessage: [{
                    message: 'Forbidden',
                    field: 'token'
                }]
            }
        }
        return await this.securityRepositories.deleteDevice(res.data.iat, deviceIdParam)
    }

    async getAllSessions(data: IDecodeRefreshToken) {

        const {userId} = data;

        const response = await this.securityQueryRepositories.allSessionsUser(userId)

        if (response.status === ResultCode.Success) {
            return response
        }

        return response;
    }

    async deleteCurrentSession(data: IDecodeRefreshToken) {
        const {iat, userId, deviceId} = data;

        const response = await this.securityRepositories.deleteDevice(iat, deviceId)

        if (response.errorsMessage) {
            return {
                ...response
            }
        }
        return true;
    }

    async deleteDevices(token: string) {

        const decode = await decodeToken(token);

        if (!decode) {
            return {
                status: ResultCode.Unauthorized,
                data: null,
            }
        }

        return await this.securityRepositories.deleteDevicesButCurrent(decode)
    }

    async updateVersionSession(token: string) {
        const data = await decodeToken(token)

        if (!data) {
            return {
                status: ResultCode.Unauthorized,
                data: null,
                errorsMessage: [{
                    message: 'Something went1 wrong',
                    field: 'token'
                }]
            }
        }

        const response = await this.securityRepositories.updateDevice(data);

        if (!response) {
            return {
                status: ResultCode.Unauthorized,
                data: null,
                errorsMessage: [{
                    message: 'Something went2 wrong',
                    field: 'token'
                }]
            }
        }

        return {
            status: ResultCode.Success,
            data: null,
        }
    }
}
