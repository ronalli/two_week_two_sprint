import {Db, MongoClient} from 'mongodb'
import {SETTINGS} from "../settings";
import {IUserDBType} from "../users/types/user-types";
import {IPostDBType} from "../posts/types/posts-types";

export const db = {
    client: {} as MongoClient,
    getDbName(): Db {
        return this.client.db(SETTINGS.DB_NAME);
    },

    async run(url: string) {
        try {
            this.client = new MongoClient(url);
            await this.client.connect();
            await this.getDbName().command({ping: 1});
            console.log('Connected successfully to mongo server');
        } catch (e: unknown) {
            console.error("Can't connect to mongo server");
            await this.stop();
        }
    },

    async stop() {
        await this.client.close();
        console.log('Connection successfully closed');
    },

    async drop() {
        try {

            const collections = await this.getDbName().listCollections().toArray();

            for(const collection of collections) {
                const collectionName = collection.name;
                await this.getDbName().collection(collectionName).deleteMany({});
            }

        } catch (e: unknown) {
            console.error('Error id drop db: ', e);
            await this.stop();
        }
    },
    getCollections() {
        return {
            usersCollection: this.getDbName().collection<IUserDBType>('users'),
            postsCollection: this.getDbName().collection<IPostDBType>('posts'),
            blogsCollection: this.getDbName().collection<IPostDBType>('blogs'),
        }
    }
}