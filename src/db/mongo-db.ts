import {Collection, Db, MongoClient} from 'mongodb'

import * as mongoose from 'mongoose'

import {SETTINGS} from "../settings";
import {IBlogDBType} from "../blogs/types/blogs-types";
import {IPostDBType} from "../posts/types/posts-types";
import {ICommentDBType} from "../comments/types/comments-types";
import {IRefreshTokenDBType} from "../types/refresh-token-type";
import {IRateLimitTypeDB} from "../types/rate-limit-type";

const client = new MongoClient(SETTINGS.MONGO_URL);
export const db: Db = client.db(SETTINGS.DB_NAME);

export const blogsCollection: Collection<IBlogDBType> = db.collection<IBlogDBType>(SETTINGS.BLOG_COLLECTION_NAME);
export const postsCollection: Collection<IPostDBType> = db.collection<IPostDBType>(SETTINGS.POSTS_COLLECTION_NAME);
export const commentsCollection: Collection<ICommentDBType> = db.collection<ICommentDBType>(SETTINGS.COMMENTS_COLLECTION_NAME);
export const refreshTokenCollection: Collection<IRefreshTokenDBType> = db.collection<IRefreshTokenDBType>(SETTINGS.REFRESH_TOKENS_COLLECTION_NAME)

export const rateLimitCollection: Collection<IRateLimitTypeDB> = db.collection<IRateLimitTypeDB>(SETTINGS.RATE_LIMIT_COLLECTION_NAME)


export const connectToDB = async () => {
    try {
        await client.connect();
        await mongoose.connect(SETTINGS.MONGO_URL, {dbName: SETTINGS.DB_NAME})
        console.log('connected to DB');
        return true;
    } catch (e) {
        console.log(e)
        await client.close();
        return false
    }
}