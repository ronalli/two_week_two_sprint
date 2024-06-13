import 'reflect-metadata';

import {db} from "../../src/db/db";
import {req} from "../test-helpers";
import {HTTP_STATUSES, SETTINGS} from "../../src/settings";
import {serviceComments} from "../utils/serviceComments";

describe("Comments Tests", () => {
    beforeAll(async () => {
        await db.run();
    })

    afterEach(async () => {
        await db.dropCollections();
    })

    afterAll(async () => {
        await db.dropDB()

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

    it('should correct create comment', async () => {

        const comment = await serviceComments.createComment()

        await req.get(SETTINGS.PATH.COMMENTS + `/${comment.id}`).expect(HTTP_STATUSES.Success)
    })

    it('should correct update comment ', async () => {

        const comment = await serviceComments.createComment()
        const response = await req.post(SETTINGS.PATH.AUTH + '/login').send({
            loginOrEmail: 'testing',
            password: '12345678'
        }).expect(HTTP_STATUSES.Success)

        await req.put(SETTINGS.PATH.COMMENTS + `/${comment.id}`).set('Authorization', `Bearer ${response.body.accessToken}`).send({"content": "hello my friend and all people"}).expect(HTTP_STATUSES.NotContent)

    });

    it('shouldn\'t correct update stranger comment ', async () => {

        const comment = await serviceComments.createComment()

        const newUser = await req.post(SETTINGS.PATH.USERS).set('Authorization', process.env.AUTH_HEADER || '').send({
            login: 'Bob',
            password: '12345678',
            email: 'bob@gmail.com'
        }).expect(HTTP_STATUSES.Created)

        const response = await req.post(SETTINGS.PATH.AUTH + '/login').send({
            loginOrEmail: 'Bob',
            password: '12345678'
        }).expect(HTTP_STATUSES.Success)

        await req.put(SETTINGS.PATH.COMMENTS + `/${comment.id}`).set('Authorization', `Bearer ${response.body.accessToken}`).send({"content": "hello my friend and all people"}).expect(HTTP_STATUSES.Forbidden)

    });

})