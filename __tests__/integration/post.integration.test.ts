import {MongoMemoryServer} from "mongodb-memory-server";
import {db} from "../../src/db/db";
import {req} from "../test-helpers";
import {SETTINGS} from "../../src/settings";
import {servicePosts} from "../utils/servicePosts";
import {ObjectId} from "mongodb";
import {PostModel} from "../../src/posts/domain/post.entity";

describe('post-integration', () => {

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

    describe('Post', () => {


        it('should correct create post', async () => {

            const post = await servicePosts.createPost();
            const res = await req.get(SETTINGS.PATH.POSTS)
            expect(res.body.items.length).toBe(1);
            expect(res.body.items[0].id).toBe(post.id);

        })

        it('should correct return array posts', async () => {

            const posts = await servicePosts.createPosts(7);
            const res = await req.get(SETTINGS.PATH.POSTS)
            expect(res.body.items.length).toBe(7);
            expect(res.status).toBe(200)

        })

        it('should correct delete post', async () => {
            const post = await servicePosts.createPost();

            const deletePost = await PostModel.deleteOne({_id: new ObjectId(post.id)});

            const res = await req.get(SETTINGS.PATH.POSTS)

            expect(res.body.items.length).toBe(0);

        })

        it('should not return post with incorrect id', async () => {

            const response = await req.get(SETTINGS.PATH.POSTS + '/5we4etr45ew534te4rd')

            expect(response.status).toBe(404)

        })

    })
})