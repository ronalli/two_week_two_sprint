import {req} from "./test-helpers";
import {HTTP_STATUSES} from "../src/settings";
import {SETTINGS} from "../src/settings";
import {db} from "../src/db/db";

import {MongoMemoryServer} from "mongodb-memory-server";

describe("Auth Tests", () => {
    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create();
        await db.run(mongoServer.getUri());

        await req.post(SETTINGS.PATH.USERS).set('Authorization', process.env.AUTH_HEADER || '')
            .send({
                login: 'bob',
                password: 'qwerty',
                email: 'bob@gmail.com',
            })
    })

    afterAll(async () => {
        await db.stop();
    })

    afterAll(async () => {
        await req.delete(SETTINGS.PATH.ALL_DELETE + '/all-data')
    })

    afterAll(done => done())

    it("shouldn't correct auth - not found user", async () => {
        const auth = {
            loginOrEmail: 'bob',
            password: 'password',
        }
        await req.post(SETTINGS.PATH.AUTH + '/login').send(auth).expect(HTTP_STATUSES.UNAUTHORIZED)
    })

    it("should correct authorization", async() => {
        const auth = {
            loginOrEmail: 'bob',
            password: 'qwerty',
        }
        await req.post(SETTINGS.PATH.AUTH + '/login').send(auth).expect(HTTP_STATUSES.NO_CONTENT_204)
    })

})