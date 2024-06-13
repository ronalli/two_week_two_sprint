import 'reflect-metadata';

import {db} from "../../src/db/db";
import {serviceComments} from "../utils/serviceComments";
import {req} from "../test-helpers";
import {HTTP_STATUSES, SETTINGS} from "../../src/settings";

describe('Status like', () => {

    beforeAll(async () => {
        await db.run();
        await serviceComments.createComments(5)
    })

    afterAll(async () => {
        await db.dropDB()
    })

    afterAll(done => done())


    it('should correct return length comments by post with field likesInfo', async () => {

        const response = await req.get(SETTINGS.PATH.POSTS)

        const id = response.body.items[0].id;

        const result = await req.get(SETTINGS.PATH.POSTS + `/${id}/comments`)

        expect(result.body.items).toHaveLength(5)

    })

    it('should correct update like status', async () => {

        const comments = await req.get(SETTINGS.PATH.POSTS)

        const result = await req.get(SETTINGS.PATH.POSTS + `/${comments.body.items[0].id}/comments`)

        const user = await req.post(SETTINGS.PATH.AUTH + '/login').send({
            "loginOrEmail": "testing",
            "password": '12345678'
        })

       await req.put(SETTINGS.PATH.COMMENTS + `/${result.body.items[0].id}/like-status`).set('Authorization', `Bearer ${user.body.accessToken}`).send({
            "likeStatus": "Like"
        }).expect(HTTP_STATUSES.NotContent)

        const res = await req.get(SETTINGS.PATH.COMMENTS + `/${result.body.items[0].id}`).set('Authorization', `Bearer ${user.body.accessToken}`)

        expect(res.body.likesInfo.likesCount).toBe(1)
        expect(res.body.likesInfo.dislikesCount).toBe(0)
        expect(res.body.likesInfo.myStatus).toBe('Like')

        const res1 = await req.get(SETTINGS.PATH.COMMENTS + `/${result.body.items[0].id}`)

        expect(res1.body.likesInfo.likesCount).toBe(1)
        expect(res1.body.likesInfo.dislikesCount).toBe(0)
        expect(res1.body.likesInfo.myStatus).toBe('None')

        await req.put(SETTINGS.PATH.COMMENTS + `/${result.body.items[0].id}/like-status`).set('Authorization', `Bearer ${user.body.accessToken}`).send({
            "likeStatus": "Dislike"
        }).expect(HTTP_STATUSES.NotContent)

        const res2 = await req.get(SETTINGS.PATH.COMMENTS + `/${result.body.items[0].id}`).set('Authorization', `Bearer ${user.body.accessToken}`)

        expect(res2.body.likesInfo.likesCount).toBe(0)
        expect(res2.body.likesInfo.dislikesCount).toBe(1)
        expect(res2.body.likesInfo.myStatus).toBe('Dislike')

    })


})