import {sessionsCollection} from "../db/mongo-db";
import {ResultCode} from "../types/resultCode";
import {IDecodeRefreshToken} from "../types/refresh-token-type";

export const securityRepositories = {
    deleteDevice: async (iat: string) => {

        try {
           const success = await sessionsCollection.findOneAndDelete({iat: iat})

            return {
               status: ResultCode.NotContent, data: null
            }

        } catch (e) {
            return {
                status: ResultCode.InternalServerError,
                data: null,
                errorsMessage: [{
                    message: 'Error DB',
                    field: 'db'
                }]
            }
        }

    },

    deleteDevicesButCurrent: async (data: IDecodeRefreshToken) => {
        const {iat, userId, deviceId} = data;

        try {
            const currentSession = await sessionsCollection.findOne({iat: iat})

            await sessionsCollection.deleteMany({userId: userId, _id: {$ne: currentSession?._id}})

            return {
                status: ResultCode.NotContent,
                data: null
            }
        }
        catch (e) {
            return {
                status: ResultCode.InternalServerError,
                data: null,
                errorsMessage: [{
                    message: 'Error DB',
                    field: 'db'
                }]
            }
        }

    },

    getDevices: async (id: string, deviceId: string) => {
        try {
            const findedSession = await sessionsCollection.findOne({userId: id, deviceId: deviceId})
                return {
                    status: ResultCode.Success,
                    data: findedSession
                }
        } catch(e) {
            return {
                status: ResultCode.InternalServerError,
                errorsMessage: [
                    {
                        message: 'Error DB',
                        field: 'token'
                    }
                ]
            }
        }

    }
}