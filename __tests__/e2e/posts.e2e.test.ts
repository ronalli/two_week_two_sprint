import 'reflect-metadata';

import {req} from "../test-helpers";
import {HTTP_STATUSES} from "../../src/settings";
import {db} from '../../src/db/db';
import {SETTINGS} from "../../src/settings";
import {IBlogInputModel} from "../../src/blogs/types/blogs-types";
import {IPostInputModel} from "../../src/posts/types/posts-types";

describe('Posts Tests', () => {
    beforeAll(async () => {
        await db.run()
    })

    afterAll(async () => {
        await db.dropDB()
    })

    it('shouldn\'t create post, as not found blogId', async () => {
        const newPost = {
            blogId: 'fsd',
            content: 'content 2',
            shortDescription: 'short description',
            title: 'test 2'
        }
        const res = await req.post(SETTINGS.PATH.POSTS)
            .set('Authorization', process.env.AUTH_HEADER || '')
            .send(newPost).expect(HTTP_STATUSES.BadRequest);
    });

    it('shouldn\'t create post, as not found authorization header', async () => {
        const newPost = {
            blogId: 'fsd',
            content: 'content 2',
            shortDescription: 'short description',
            title: 'test 2'
        }
        const res = await req.post(SETTINGS.PATH.POSTS)
            .send(newPost).expect(HTTP_STATUSES.Unauthorized);
    });

    it('should create post', async () => {
        const newBlog: IBlogInputModel = {
            name: 'valid name',
            description: 'valid description',
            websiteUrl: 'https://it-incubator.com',
        }
        const createBlog = await req.post(SETTINGS.PATH.BLOGS).set('Authorization', process.env.AUTH_HEADER || '').send(newBlog)

        const newPost: IPostInputModel = {
            blogId: createBlog.body.id,
            content: 'content 2',
            shortDescription: 'short description',
            title: 'test 2'
        }
        const res = await req.post(SETTINGS.PATH.POSTS)
            .set('Authorization', process.env.AUTH_HEADER || '')
            .send(newPost).expect(HTTP_STATUSES.Created);

        const findPost = await  req.get(`${SETTINGS.PATH.POSTS}/${res.body.id}`).expect(HTTP_STATUSES.Success)
    });
    it('should correct update post', async () => {

        const findPosts = await req.get(SETTINGS.PATH.POSTS);

        const updatePost: IPostInputModel = {
            title: 'test 2',
            blogId: findPosts.body.items[0].blogId,
            content: 'content 2',
            shortDescription: 'short description',
        }

        const res = await req.put(`${SETTINGS.PATH.POSTS}/${String(findPosts.body.items[0].id)}`)
            .set('Authorization', process.env.AUTH_HEADER || '')
            .send(updatePost)
            .expect(HTTP_STATUSES.NotContent)

    });

    it('should success delete post', async () => {
        const findPosts = await req.get(SETTINGS.PATH.POSTS);

         await req.delete(`${SETTINGS.PATH.POSTS}/${findPosts.body.items[0].id}`)
            .set('Authorization', process.env.AUTH_HEADER || '')
            .expect(HTTP_STATUSES.NotContent)

        await req.get(`${SETTINGS.PATH.POSTS}/${findPosts.body.items[0].id}`).expect(HTTP_STATUSES.NotFound)

    })

});