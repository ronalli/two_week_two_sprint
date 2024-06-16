import 'reflect-metadata';

import {db} from "../../src/db/db";
import {serviceComments} from "../utils/serviceComments";
import {req} from "../test-helpers";
import cookie from "cookie";
import {HTTP_STATUSES, SETTINGS} from "../../src/settings";
import {servicePosts} from "../utils/servicePosts";
import {serviceLogin} from "../utils/serviceRegistration";
import {jwtService} from "../../src/utils/jwt-services";

describe('Status like', () => {

    beforeAll(async () => {
        await db.run();
        await servicePosts.createPost();
    })

    afterAll(async () => {
        await db.dropDB()
    })

    afterAll(done => done())

    it('should correct add like status by post', async () => {

        const response = await req.get(SETTINGS.PATH.POSTS).expect(HTTP_STATUSES.Success);

        expect(response.body.items[0].extendedLikesInfo.likesCount).toBe(0)
        expect(response.body.items[0].extendedLikesInfo.dislikesCount).toBe(0)
        expect(response.body.items[0].extendedLikesInfo.myStatus).toBe('None')
        expect(response.body.items[0].extendedLikesInfo.newestLikes).toEqual([])

        const user = await serviceLogin.user();


        await req.put(SETTINGS.PATH.POSTS + `/${response.body.items[0].id}/like-status`).set('Authorization', `Bearer ${user.accessToken}`).send({
            "likeStatus": "Like"
        }).expect(HTTP_STATUSES.NotContent)

        const res1 = await req.get(SETTINGS.PATH.POSTS).expect(HTTP_STATUSES.Success);

        expect(res1.body.items[0].extendedLikesInfo.likesCount).toBe(1)
        expect(res1.body.items[0].extendedLikesInfo.dislikesCount).toBe(0)
        expect(res1.body.items[0].extendedLikesInfo.myStatus).toBe('None')
        expect(res1.body.items[0].extendedLikesInfo.newestLikes).toHaveLength(1)

        const id = await jwtService.getUserIdByToken(user.accessToken);

        expect(res1.body.items[0].extendedLikesInfo.newestLikes[0].userId).toBe(id)

    })
})