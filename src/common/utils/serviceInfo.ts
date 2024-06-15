import {decodeToken} from "./decodeToken";
import {LikeModel} from "../../comments/domain/like.entity";
import {jwtService} from "../../utils/jwt-services";

export const serviceInfo = {
    async initializeStatusLike(token: string, parentId: string) {
        const currentAccount = await decodeToken(token)

        if(!currentAccount) {
            return 'None'
        }

        const response = await LikeModel.findOne(({
            $and: [{userId: currentAccount.userId}, {parentId:  parentId}]
        }))

        if(!response) {
            return 'None'
        }

        return response.status
    },

    async getIdUserByToken(token: string | undefined): Promise<string> {
        if(!token) {
            return 'None'
        }
        return await jwtService.getUserIdByToken(token)
    }
}