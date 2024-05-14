import {req} from "../test-helpers";
import {db} from '../../src/db/db'
import {MongoMemoryServer} from "mongodb-memory-server";
import {HTTP_STATUSES} from "../../src/settings";
import {SETTINGS} from "../../src/settings";
import {testSeeder} from "../utils/test.seeder";


describe('Blogs Tests', () => {
    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create();
        await db.run(mongoServer.getUri());
        await req.delete(SETTINGS.PATH.ALL_DELETE + '/all-data')
    })

    afterAll(async () => {
        await req.delete(SETTINGS.PATH.ALL_DELETE + '/all-data')
        await db.stop();
    })

    afterAll(done => done())

    it('should created blog', async () => {
        const blog = testSeeder.createBlogDto()
        const resCreated = await req.post(SETTINGS.PATH.BLOGS)
            .set('Authorization', process.env.AUTH_HEADER || '')
            .send(blog).expect(HTTP_STATUSES.Created)

        const res = await req.get(`${SETTINGS.PATH.BLOGS}/${String(resCreated.body.id)}`).expect(HTTP_STATUSES.Success)
        expect(String(resCreated.body.id)).toEqual(res.body.id);
    });

    it('shouldn\'t created blog, because not found authorization header', async () => {
        const blog = testSeeder.createBlogDto();
        const resCreated = await req.post(SETTINGS.PATH.BLOGS).send(blog).expect(HTTP_STATUSES.Unauthorized)
    });

    it('shouldn\'t created blog, because incorrect data', async () => {
        const blog = {
            name: 't',
            websiteUrl: 'https://it-incubator..com',
            description: 'valid description',
        }
        const resCreated = await req.post(SETTINGS.PATH.BLOGS).set('Authorization', process.env.AUTH_HEADER || '')
            .send(blog).expect(HTTP_STATUSES.BadRequest)
    });
    it('shouldn\'t created blog, because not found correct data', async () => {
        const blog = {
            name: 't',
            websiteUrl: 'https://it-incubator..com',
        }
        const resCreated = await req.post(SETTINGS.PATH.BLOGS).set('Authorization', process.env.AUTH_HEADER || '')
            .send(blog).expect(HTTP_STATUSES.BadRequest)
    });

    it('shouldn\'t created blog, because not found correct authorization header', async () => {
        const blog = testSeeder.createBlogDto();
        const resCreated = await req.post(SETTINGS.PATH.BLOGS).set('Authorization', process.env.AUTH_HEADER_FAIL || '')
            .send(blog).expect(HTTP_STATUSES.Unauthorized)
    });

    it('should created blog, and return correct data', async () => {

        const blog = testSeeder.createBlogDto();
        const resCreated = await req.post(SETTINGS.PATH.BLOGS).set('Authorization', process.env.AUTH_HEADER || '')
            .send(blog).expect(HTTP_STATUSES.Created)

        const res = await req.get(`${SETTINGS.PATH.BLOGS}/${String(resCreated.body.id)}`).expect(HTTP_STATUSES.Success);

        expect(resCreated.body).toEqual(res.body)
    });

    it('should get correct blog', async () => {
        const foundBlogs = await req.get(SETTINGS.PATH.BLOGS).expect(HTTP_STATUSES.Success);

        const res = await req.get(`${SETTINGS.PATH.BLOGS}/${String(foundBlogs.body.items[0].id)}`).expect(HTTP_STATUSES.Success);

        expect(foundBlogs.body.items[0].id).toEqual(res.body.id)
    });

    it('shouldn\'t get blog with incorrect id', async () => {
        const res = await req.get(`${SETTINGS.PATH.BLOGS}/${String(35534534534534)}`).expect(HTTP_STATUSES.NotFound);
    });

    it('should correct delete blog', async () => {
        const foundBlogs = await req.get(SETTINGS.PATH.BLOGS).expect(HTTP_STATUSES.Success);

        await req.delete(`${SETTINGS.PATH.BLOGS}/${String(foundBlogs.body.items[0].id)}`)
            .set('Authorization', process.env.AUTH_HEADER || '')
            .expect(HTTP_STATUSES.NotContent);

        const res = await req.get(`${SETTINGS.PATH.BLOGS}/${String(foundBlogs.body.items[0].id)}`).expect(HTTP_STATUSES.NotFound)
    });

    it('should correct update blog', async () => {
        const findBlogs = await req.get(SETTINGS.PATH.BLOGS);

        const updateBlogs = testSeeder.createBlogDto();

        await req.put(`${SETTINGS.PATH.BLOGS}/${String(findBlogs.body.items[0].id)}`)
            .set('Authorization', process.env.AUTH_HEADER || '')
            .send(updateBlogs)
            .expect(HTTP_STATUSES.NotContent)

    })

    it('should correct delete vlog', async () => {
        const findBlogs = await req.get(SETTINGS.PATH.BLOGS);

        await req.delete(`${SETTINGS.PATH.BLOGS}/${String(findBlogs.body.items[0].id)}`)
            .set('Authorization', process.env.AUTH_HEADER || '')
            .expect(HTTP_STATUSES.NotContent);

        await req.get(`${SETTINGS.PATH.BLOGS}/${String(findBlogs.body.items[0].id)}`).expect(HTTP_STATUSES.NotFound)
    })

    it('should get errors with incorrect query params', async () => {
        const foundBlogs = await req.get(`${SETTINGS.PATH.BLOGS}?sortBy=1&pageNumber=sr&pageSize=rt&SortDirection=ty`).expect(HTTP_STATUSES.BadRequest);
    });

    it('should get blogs with correct query params', async () => {
        const foundBlogs = await req.get(`${SETTINGS.PATH.BLOGS}?sortBy=name&pageNumber=2&pageSize=2&SortDirection=desc`).expect(HTTP_STATUSES.Success);

    });


    it('should create post for special blog', async () => {
        const newBlog = testSeeder.createBlogDto();

        const blog = await req.post(SETTINGS.PATH.BLOGS)
            .set('Authorization', process.env.AUTH_HEADER || '')
            .send(newBlog).expect(HTTP_STATUSES.Created)

        const newPost = testSeeder.createPostDto();

        const post = await req.post(SETTINGS.PATH.BLOGS + `/${blog.body.id}/posts`)
            .set('Authorization', process.env.AUTH_HEADER || '')
            .send(newPost)

        expect(blog.body.id).toBe(post.body.blogId)
        expect(newPost.title).toBe(post.body.title)

    });
})