import {sessionsCollection} from "../db/mongo-db";
import {ResultCode} from "../types/resultCode";

export const securityQueryRepositories = {

    allSessionsUser: async (id: string) => {
        try {
            const result = await sessionsCollection.find({userId: id, exp: {$gt: new Date().toISOString()}}).toArray();

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