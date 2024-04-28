import {req} from "./test-helpers";
import {db} from '../src/db/db'
import {MongoMemoryServer} from "mongodb-memory-server";
import {HTTP_STATUSES} from "../src/settings";
import {SETTINGS} from "../src/settings";
import {IBlogInputModel} from "../src/blogs/types/blogs-types";
import {IPostInputModel} from "../src/posts/types/posts-types";


describe('Blogs Tests', () => {
    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create();
        await db.run(mongoServer.getUri());
        await req.delete(SETTINGS.PATH.ALL_DELETE + '/all-data')
    })

    afterAll(async () => {
        await db.stop();
    })

    afterAll(async () => {
        await req.delete(SETTINGS.PATH.ALL_DELETE + '/all-data')
    })

    afterAll(done => done())

    it('should created blog', async () => {
        const blog = {
            name: 'test',
            websiteUrl: 'https://it-incubator.com',
            description: 'valid description',
        }
        const resCreated = await req.post(SETTINGS.PATH.BLOGS)
            .set('Authorization', process.env.AUTH_HEADER || '')
            .send(blog).expect(HTTP_STATUSES.CREATED_201)

        const res = await req.get(`${SETTINGS.PATH.BLOGS}/${String(resCreated.body.id)}`).expect(HTTP_STATUSES.OK_200)
        expect(String(resCreated.body.id)).toEqual(res.body.id);
    });

    it('shouldn\'t created blog, because not found authorization header', async () => {
        const blog = {
            name: 'test',
            websiteUrl: 'https://it-incubator.com',
            description: 'valid description',
        }
        const resCreated = await req.post(SETTINGS.PATH.BLOGS).send(blog).expect(HTTP_STATUSES.UNAUTHORIZED)
    });

    it('shouldn\'t created blog, because incorrect data', async () => {
        const blog = {
            name: 't',
            websiteUrl: 'https://it-incubator..com',
            description: 'valid description',
        }
        const resCreated = await req.post(SETTINGS.PATH.BLOGS).set('Authorization', process.env.AUTH_HEADER || '')
            .send(blog).expect(HTTP_STATUSES.BED_REQUEST_400)
    });
    it('shouldn\'t created blog, because not found correct data', async () => {
        const blog = {
            name: 't',
            websiteUrl: 'https://it-incubator..com',
        }
        const resCreated = await req.post(SETTINGS.PATH.BLOGS).set('Authorization', process.env.AUTH_HEADER || '')
            .send(blog).expect(HTTP_STATUSES.BED_REQUEST_400)
    });

    it('shouldn\'t created blog, because not found correct authorization header', async () => {
        const blog = {
            name: 'test valid',
            websiteUrl: 'https://it-incubator.com',
            description: 'valid description',
        }
        const resCreated = await req.post(SETTINGS.PATH.BLOGS).set('Authorization', process.env.AUTH_HEADER_FAIL || '')
            .send(blog).expect(HTTP_STATUSES.UNAUTHORIZED)
    });

    it('should created blog, and return correct data', async () => {
        const blog = {
            name: 'test valid',
            websiteUrl: 'https://it-incubator.com',
            description: 'valid description',
        }
        const resCreated = await req.post(SETTINGS.PATH.BLOGS).set('Authorization', process.env.AUTH_HEADER || '')
            .send(blog).expect(HTTP_STATUSES.CREATED_201)

        const res = await req.get(`${SETTINGS.PATH.BLOGS}/${String(resCreated.body.id)}`).expect(HTTP_STATUSES.OK_200);

        expect(resCreated.body).toEqual(res.body)
    });

    it('should get correct blog', async () => {
        const foundBlogs = await req.get(SETTINGS.PATH.BLOGS).expect(HTTP_STATUSES.OK_200);

        // console.log(foundBlogs.body.items)

        const res = await req.get(`${SETTINGS.PATH.BLOGS}/${String(foundBlogs.body.items[0].id)}`).expect(HTTP_STATUSES.OK_200);
        //
        expect(foundBlogs.body.items[0].id).toEqual(res.body.id)
    });

    it('shouldn\'t get blog with incorrect id', async () => {
        const res = await req.get(`${SETTINGS.PATH.BLOGS}/${String(35534534534534)}`).expect(HTTP_STATUSES.NOT_FOUND_404);
    });

    it('should correct delete blog', async () => {
        const foundBlogs = await req.get(SETTINGS.PATH.BLOGS).expect(HTTP_STATUSES.OK_200);

        await req.delete(`${SETTINGS.PATH.BLOGS}/${String(foundBlogs.body.items[0].id)}`)
            .set('Authorization', process.env.AUTH_HEADER || '')
            .expect(HTTP_STATUSES.NO_CONTENT_204);

        const res = await req.get(`${SETTINGS.PATH.BLOGS}/${String(foundBlogs.body.items[0].id)}`).expect(HTTP_STATUSES.NOT_FOUND_404)
    });
    it('should correct update blog', async () => {
        const findBlogs = await req.get(SETTINGS.PATH.BLOGS);

        const updateBlogs: IBlogInputModel = {
            name: 'test valid',
            websiteUrl: 'https://example.com',
            description: 'valid description',
        }

        await req.put(`${SETTINGS.PATH.BLOGS}/${String(findBlogs.body.items[0].id)}`)
            .set('Authorization', process.env.AUTH_HEADER || '')
            .send(updateBlogs)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

    })

    it('should correct delete vlog', async () => {
        const findBlogs = await req.get(SETTINGS.PATH.BLOGS);

        await req.delete(`${SETTINGS.PATH.BLOGS}/${String(findBlogs.body.items[0].id)}`)
            .set('Authorization', process.env.AUTH_HEADER || '')
            .expect(HTTP_STATUSES.NO_CONTENT_204);

        await req.get(`${SETTINGS.PATH.BLOGS}/${String(findBlogs.body.items[0].id)}`).expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it('should get errors with incorrect query params', async () => {
        const foundBlogs = await req.get(`${SETTINGS.PATH.BLOGS}?sortBy=1&pageNumber=sr&pageSize=rt&SortDirection=ty`).expect(HTTP_STATUSES.BED_REQUEST_400);
    });

    it('should get blogs with correct query params', async () => {
        const foundBlogs = await req.get(`${SETTINGS.PATH.BLOGS}?sortBy=name&pageNumber=2&pageSize=2&SortDirection=desc`).expect(HTTP_STATUSES.OK_200);

    });

    it('should create post for special blog', async () => {
        const newBlog: IBlogInputModel = {
            name: 'test valid',
            websiteUrl: 'https://example.com',
            description: 'valid description',
        }

        const blog = await req.post(SETTINGS.PATH.BLOGS)
            .set('Authorization', process.env.AUTH_HEADER || '')
            .send(newBlog)

        const newPost = {
            content: 'content 2',
            shortDescription: 'short description',
            title: 'test 2',
        }

        const post = await req.post(SETTINGS.PATH.BLOGS + `/${blog.body.id}/posts`)
            .set('Authorization', process.env.AUTH_HEADER || '')
            .send(newPost).expect(HTTP_STATUSES.CREATED_201)

        // console.log(post.body)

        expect(blog.body.id).toBe(post.body.blogId)
        expect(newPost.title).toBe(post.body.title)

    });
})