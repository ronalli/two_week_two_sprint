import {sessionsCollection} from "../db/mongo-db";
import {ResultCode} from "../types/resultCode";
import {DeviceModel} from "./domain/device.entity";

export const securityQueryRepositories = {

    allSessionsUser: async (id: string) => {
        try {

            const result = await DeviceModel.find({userId: id, exp: {$gt: new Date().toISOString()}}).lean();

            if(result.length === 0){
                return {
                    status: ResultCode.Unauthorized,
                    data: null,
                    errorsMessage: [
                        {
                            message: 'Error token',
                            field: 'session'
                        }
                    ]
                }
            }

            return {
                status: ResultCode.Success,
                data: result
            }

        } catch (e) {
            return {
                status: ResultCode.InternalServerError,
                data: null,
                errorsMessage: [
                    {
                        message: 'Error DB',
                        field: 'session'
                    }
                ]
            }
        }

    }

}