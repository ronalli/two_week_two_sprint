import {UserModel} from "../users/domain/user.entity";
import {ResultCode} from "../types/resultCode";
import {injectable} from "inversify";

@injectable()
export class AuthQueryRepositories {
    async findByEmail(email: string){
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