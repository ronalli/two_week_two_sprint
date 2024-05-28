import {sessionsCollection} from "../db/mongo-db";
import {ResultCode} from "../types/resultCode";
import {IDecodeRefreshToken} from "../types/refresh-token-type";

export const securityRepositories = {
    deleteDevice: async (iat: string, deviceId: string) => {

        try {
            const success = await sessionsCollection.findOneAndDelete({iat: iat, deviceId: deviceId})

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

    getDevice: async (deviceId: string) => {
        try {
            const res = await sessionsCollection.findOne({deviceId: deviceId})

            return {
                status: ResultCode.Success,
                data: res
            }
        } catch (e) {
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

    },

    updateDevice: async (data: IDecodeRefreshToken) => {

        const {iat, deviceId, userId, exp} = data;

        return await sessionsCollection.findOneAndUpdate({$and: [{deviceId: deviceId}, {userId: userId}]}, {
            $set: {
                iat: iat,
                exp: exp
            }
        }, { returnDocument: 'after' })
    }
}