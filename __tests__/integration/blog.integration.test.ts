import {MongoMemoryServer} from "mongodb-memory-server";
import {db} from "../../src/db/db";
import {serviceBlogs} from "../utils/serviceBlogs";
import {blogsCollection} from "../../src/db/mongo-db";
import {ObjectId} from "mongodb";
import {req} from "../test-helpers";
import {SETTINGS} from "../../src/settings";
import {response} from "express";

describe('blog-integration', () => {

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

    describe('Blog', () => {


        it('Response correct view model blog', async () => {
            const blog = await serviceBlogs.createBlog();
            expect(blog).toEqual({
                id: expect.any(String),
                name: expect.any(String),
                description: expect.any(String),
                websiteUrl: expect.any(String),
                createdAt: expect.any(String),
                isMembership: expect.any(Boolean)
            })

        })

        it('response null', async () => {

            const res = await blogsCollection.findOne({_id: new ObjectId('66487a05cbf8a1d138e6fd3c')})

            expect(res).toBe(null)
        })

        it('should correct blog', async () => {
            const blog = await serviceBlogs.createBlog();
            const res = await blogsCollection.findOne({_id: new ObjectId(blog.id)})

            expect(res).toBeDefined()

            expect(blog.name).toBe(res?.name)
            expect(blog.description).toBe(res?.description)
            expect(blog.websiteUrl).toBe(res?.websiteUrl)
            expect(blog.description).toBe(res?.description)
            expect(blog.createdAt).toBe(res?.createdAt)
            expect(blog.isMembership).toBe(res?.isMembership)

        })

        it('should correct length blogs', async () => {
            const blogs = await serviceBlogs.createBlogs(5);

            const response =  await blogsCollection.find({}).toArray();

            expect(blogs.length).toEqual(response.length)
        })

        it('should response correct status on request blogs', async () => {
            const res = await req.get(SETTINGS.PATH.BLOGS)

            expect(res.body.items).toEqual([])

            expect(res.status).toEqual(200)
        })

        it('should response correct length blogs', async () => {

            const blogs = await serviceBlogs.createBlogs(6);

            const res = await req.get(SETTINGS.PATH.BLOGS)

            expect(res.body.items).toBeDefined()

            expect(res.body.items.length).toEqual(6);
            expect(res.status).toEqual(200)
        })

        it('should correct get blog by id', async () => {

            const blog = await serviceBlogs.createBlog();

            const res = await req.get(SETTINGS.PATH.BLOGS + `/${blog.id}`)

            expect(res.body).toBeDefined()
            expect(res.body.name).toEqual(blog.name)
            expect(res.body.id).toEqual(blog.id)
            expect(res.body.websiteUrl).toEqual(blog.websiteUrl)

        })

        it('should not correct get blog by id', async () => {

            const res = await req.get(SETTINGS.PATH.BLOGS + '/5we4etr45ew534te4rd')

            expect(res.status).toBe(404)

        })

        it('should correct delete blog', async () => {

            const blog = await serviceBlogs.createBlog();

            await blogsCollection.findOneAndDelete({_id: new ObjectId(blog.id)})

            const res = await req.get(SETTINGS.PATH.BLOGS + `/${blog.id}`)

            expect(res.status).toEqual(404)
        })

    });

})