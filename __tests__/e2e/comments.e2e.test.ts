import {MongoMemoryServer} from "mongodb-memory-server";
import {db} from "../../src/db/db";
import {req} from "../test-helpers";
import {HTTP_STATUSES, SETTINGS} from "../../src/settings";

describe("Comments Tests", () => {
    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create();
        await db.run(mongoServer.getUri());
    })


    afterEach(async () => {
        await db.drop();
    })

    afterAll(async () => {
        // await req.delete(SETTINGS.PATH.ALL_DELETE + '/all-data')
        await db.drop();
    })

    afterAll(async () => {
        await db.stop();
    })


    afterAll(done => done())

    it("shouldn't find comment with incorrect id", async () => {
        await req.get(SETTINGS.PATH.COMMENTS + '/66393f1de5e43cb44c8c1341').expect(HTTP_STATUSES.NotFound)

    })

    it("shouldn't delete comment with incorrect auth headers", async () => {
        await req.delete(SETTINGS.PATH.COMMENTS + '/66393f1de5e43cb44c8c1341').set('Authorization', 'Bearer fs5f3f.ds4ds4d.234tda22').expect(HTTP_STATUSES.Unauthorized)

    })

    it("shouldn't update comment with incorrect auth headers", async () => {
        await req.put(SETTINGS.PATH.COMMENTS + '/66393f1de5e43cb44c8c1341').set('Authorization', 'Bearer fs5f3f.ds4ds4d.234tda22').send({"content": "df4df2sdf5sd"}).expect(HTTP_STATUSES.Unauthorized)
    })

})