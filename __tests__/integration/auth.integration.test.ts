import {MongoMemoryServer} from "mongodb-memory-server";
import {db} from "../../src/db/db";

describe('auth-integration', () => {

    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create();

        await db.run(mongoServer.getUri());
    })

})