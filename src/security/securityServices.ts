import {IHeadersSession, ISessionType} from "../auth/types/sessions-types";
import {sessionsCollection} from "../db/mongo-db";
import {decodeToken} from "../common/utils/decodeToken";
import {IDecodeRefreshToken} from "../types/refresh-token-type";
import {securityQueryRepositories} from "./securityQueryRepositories";
import {ResultCode} from "../types/resultCode";
import {securityRepositories} from "./securityRepositories";
import {DeviceModel} from "./domain/device.entity";

export const securityServices = {
    createAuthSessions: async (token: string, data: IHeadersSession) => {

        const payload = await decodeToken(token)

        if (payload) {
            const session: ISessionType = {
                ...data,
                ...payload
            };

            const device = new DeviceModel(session)

            await device.save()
        }
    },

    deleteAuthSessionWithParam: async (data: IDecodeRefreshToken, deviceIdParam: string) => {
        const {iat, userId, deviceId} = data;

        const res = await securityRepositories.getDevice(deviceIdParam);

        if (res.errorsMessage) {
            return res;
        }

        if(!res.data) {
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
        return await securityRepositories.deleteDevice(res.data.iat, deviceIdParam)
    },

    getAllSessions: async (data: IDecodeRefreshToken) => {

        const {userId} = data;

        const response = await securityQueryRepositories.allSessionsUser(userId)

        if (response.status === ResultCode.Success) {
            return response
        }

        return response;

    },

    deleteCurrentSession: async (data: IDecodeRefreshToken) => {
        const {iat, userId, deviceId} = data;

        const response = await securityRepositories.deleteDevice(iat, deviceId)

        if (response.errorsMessage) {
            return {
                ...response
            }
        }

        return true;
    },

    deleteDevices: async (token: string) => {

        const decode = await decodeToken(token);

        if (!decode) {
            return {
                status: ResultCode.Unauthorized,
                data: null,
            }
        }

        return await securityRepositories.deleteDevicesButCurrent(decode)

    },

    updateVersionSession: async (token: string) => {
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

        const response = await securityRepositories.updateDevice(data);

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