import {sessionsCollection} from "../db/mongo-db";
import {ResultCode} from "../types/resultCode";

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

    deleteDevicesButCurrent: async () => {

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