import {MongoMemoryServer} from "mongodb-memory-server";
import {db} from "../../src/db/db";
import {serviceBlogs} from "../utils/serviceBlogs";

describe('blog-integration', () => {

    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create();
        await db.run(mongoServer.getUri());
    })

    beforeEach(async () => {
        await db.drop();
    })

    afterEach(async () => {

    })

    afterAll(async () => {
        await db.drop();
        await db.stop();
    })

    afterAll(done => done())

    describe('Create blog', () => {

        it('Response correct blog', async () => {
            const blog = await serviceBlogs.createBlog();

            expect(blog).toEqual({
                id: expect.any(String),
                name:  expect.any(String),
                description:  expect.any(String),
                websiteUrl:  expect.any(String),
                createdAt:  expect.any(String),
                isMembership:  expect.any(Boolean)
            })

        })

    });

})