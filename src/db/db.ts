import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";

let client = {} as MongoMemoryServer;

export const db = {

   run: async () => {
        try {
            client = await MongoMemoryServer.create()
            const uri = client.getUri();
            await mongoose.connect(uri);
            console.log('Connected successfully to mongo server');
        } catch (e: unknown) {
            console.log(e)
            console.error("Can't connect to mongo server");
            await db.stop();
        }
    },

    stop: async () => {
        await client.stop()
        console.log('Connection successfully closed');
    },

    dropDB: async () => {
        try {

            if(client) {
                await mongoose.connection.dropDatabase();
                await mongoose.connection.close();
                await db.stop();
            }

        } catch (e: unknown) {
            console.error('Error id drop db: ', e);
            await db.stop();
        }
    },
    dropCollections: async () => {
        if (client) {
            const collections = await mongoose.connection.db.collections();
            for (let collection of collections) {
                await collection.deleteMany({})
            }
        }
    }
}