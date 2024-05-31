import {Router, Request, Response} from "express";
import {HTTP_STATUSES} from "../settings";
import {
    commentsCollection,
    postsCollection, rateLimitCollection, refreshTokenCollection,
} from "../db/mongo-db";
import {DeviceModel} from "../security/domain/device.entity";
import {UserModel} from "../users/domain/user.entity";
import {BlogModel} from "../blogs/domain/blog.entity";

export const testingRouter = Router({})

testingRouter.delete('/all-data', async (req: Request, res: Response) => {
    try {
        await postsCollection.deleteMany({})
        await BlogModel.deleteMany({})
        await UserModel.deleteMany({})
        await commentsCollection.deleteMany({})
        await DeviceModel.deleteMany({})
        await rateLimitCollection.deleteMany({})
        await refreshTokenCollection.deleteMany({})
        res.status(HTTP_STATUSES.NotContent).send({})
    } catch (e) {
        console.log(e)
        return;
    }
})