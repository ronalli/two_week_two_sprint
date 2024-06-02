import {UserModel} from "../users/domain/user.entity";
import {ResultCode} from "../types/resultCode";
import {mappingUser} from "../common/utils/mappingUser";

export const authQueryRepositories = {

    findByEmail: async (email: string) => {
        try {
            const user = await UserModel.findOne({email: email})

            if (user) return {
                status: ResultCode.Success,
                data: user
            };
            return {
                errorMessage: 'Error findByEmail',
                status: ResultCode.BadRequest
            }
        } catch (e) {
            return {
                errorMessage: 'Error DB',
                status: ResultCode.InternalServerError
            }
        }
    }
}