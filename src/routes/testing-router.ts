import {Router, Request, Response} from "express";
import {HTTP_STATUSES} from "../settings";
import {blogsCollection, commentsCollection, postsCollection, usersCollection} from "../db/mongo-db";

export const testingRouter = Router({})

testingRouter.delete('/all-data', async (req: Request, res: Response) => {
    try {
        await postsCollection.deleteMany({})
        await blogsCollection.deleteMany({})
        await usersCollection.deleteMany({})
        await commentsCollection.deleteMany({})
        res.status(HTTP_STATUSES.NotContent).send({})
    } catch (e) {
        console.log(e)
        return;
    }
})