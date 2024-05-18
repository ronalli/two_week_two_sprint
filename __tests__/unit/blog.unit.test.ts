import {MongoMemoryServer} from "mongodb-memory-server";
import {db} from "../../src/db/db";
import {req} from "../test-helpers";
import {SETTINGS} from "../../src/settings";
import {serviceBlogs} from "../utils/serviceBlogs";
import {blogsCollection} from "../../src/db/mongo-db";
import {ObjectId} from "mongodb";

describe('blog-unit', () => {

    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create();
        await db.run(mongoServer.getUri());
    })

    beforeEach(async () => {
        await req.delete(SETTINGS.PATH.ALL_DELETE + '/all-data')
        await db.drop();
    })

    afterEach(async () => {

    })

    afterAll(async () => {
        // await db.drop();

        await req.delete(SETTINGS.PATH.ALL_DELETE + '/all-data')
        await db.stop();
    })

    afterAll(done => done())




})