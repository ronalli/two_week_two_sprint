// import {CollectionInfo, Db, MongoClient} from 'mongodb'
// import {SETTINGS} from "../settings";
// import {IUserDBType} from "../users/types/user-types";
// import {IPostDBType} from "../posts/types/posts-types";
// import {ICommentDBType} from "../comments/types/comments-types";
import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";

export const db = {
    // client: {} as MongoClient,

    client: {} as MongoMemoryServer,
    // connection: {} as Connection,

    // getDbName(): Db {
    //     return this.client
    // },

    async run(url: string) {
        try {
            this.client = await MongoMemoryServer.create()
            // const uri = this.client.getUri();

            await mongoose.connect(url);

            // await this.client.connect();
            // await this.getDbName().command({ping: 1});
            console.log('Connected successfully to mongo server');
        } catch (e: unknown) {
            console.error("Can't connect to mongo server");
            await this.stop();
        }
    },

    async stop() {
        await this.client.stop()
        console.log('Connection successfully closed');
    },

    async drop() {
        try {

            if(this.client) {
                await mongoose.connection.dropDatabase();
                await mongoose.connection.close();
                await this.client.stop();
            }

            // const collections: CollectionInfo[] = await this.getDbName().listCollections({}, {nameOnly: true}).toArray();
            //
            // for (const collection of collections) {
            //     const collectionName = collection.name;
            //     await this.getDbName().collection(collectionName).deleteMany({});
            // }

        } catch (e: unknown) {
            console.error('Error id drop db: ', e);
            await this.stop();
        }
    },
    // getCollections() {
    //     return {
    //         usersCollection: this.getDbName().collection<IUserDBType>('users'),
    //         postsCollection: this.getDbName().collection<IPostDBType>('posts'),
    //         blogsCollection: this.getDbName().collection<IPostDBType>('blogs'),
    //         commentsCollection: this.getDbName().collection<ICommentDBType>('comments'),
    //     }
    // }
}