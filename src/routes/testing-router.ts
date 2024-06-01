import {Router, Request, Response} from "express";
import {HTTP_STATUSES} from "../settings";
import {DeviceModel} from "../security/domain/device.entity";
import {UserModel} from "../users/domain/user.entity";
import {BlogModel} from "../blogs/domain/blog.entity";
import {PostModel} from "../posts/domain/post.entity";
import {CommentModel} from "../comments/domain/comment.entity";
import {RefreshTokenModel} from "../auth/domain/refreshToken.entity";

export const testingRouter = Router({})

testingRouter.delete('/all-data', async (req: Request, res: Response) => {
    try {
        await PostModel.deleteMany({})
        await BlogModel.deleteMany({})
        await UserModel.deleteMany({})
        await CommentModel.deleteMany({})
        await DeviceModel.deleteMany({})
        await RefreshTokenModel.deleteMany({})
        res.status(HTTP_STATUSES.NotContent).send({})
    } catch (e) {
        console.log(e)
        return;
    }
})