import {Collection, Db, MongoClient} from 'mongodb'
import {SETTINGS} from "../settings";
import {IUserDBType} from "../users/types/user-types";
import {IBlogDBType} from "../blogs/types/blogs-types";
import {IPostDBType} from "../posts/types/posts-types";
import {ICommentDBType} from "../comments/types/comments-types";
import {IRefreshTokenDBType} from "../types/refresh-token-type";

const client = new MongoClient(SETTINGS.MONGO_URL);
export const db: Db = client.db(SETTINGS.DB_NAME);

export const blogsCollection: Collection<IBlogDBType> = db.collection<IBlogDBType>(SETTINGS.BLOG_COLLECTION_NAME);
export const postsCollection: Collection<IPostDBType> = db.collection<IPostDBType>(SETTINGS.POSTS_COLLECTION_NAME);
export const usersCollection: Collection<IUserDBType> = db.collection<IUserDBType>(SETTINGS.USERS_COLLECTION_NAME);
export const commentsCollection: Collection<ICommentDBType> = db.collection<ICommentDBType>(SETTINGS.COMMENTS_COLLECTION_NAME);
export const refreshTokenCollection: Collection<IRefreshTokenDBType> = db.collection<IRefreshTokenDBType>(SETTINGS.REFRESH_TOKENS_COLLECTION_NAME)

export const connectToDB = async () => {
    try {
        await client.connect();
        console.log('connected to DB');
        return true;
    } catch (e) {
        console.log(e)
        await client.close();
        return false
    }
}