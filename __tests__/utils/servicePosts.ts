import {req} from "../test-helpers";
import {HTTP_STATUSES, SETTINGS} from "../../src/settings";
import {testSeeder} from "./test.seeder";
import {serviceBlogs} from "./serviceBlogs";
import {IPostInputModel, IPostViewModel} from "../../src/posts/types/posts-types";

export const servicePosts = {

    createPost: async ():Promise<IPostViewModel> => {

        const blog = await serviceBlogs.createBlog();

        const response = await req.post(SETTINGS.PATH.POSTS).set('Authorization', process.env.AUTH_HEADER || '').send({
            blogId: blog.id,
            title: `valid title`,
            content: `content valid post`,
            shortDescription: `post short description valid`,
        }).expect(HTTP_STATUSES.Created)
        return response.body
    },

    createPosts: async (count:number ) => {
        const blog = await serviceBlogs.createBlog();

        const posts: IPostInputModel[] = [];

        for(let i = 0; i < count; i++) {
            const response = await req.post(SETTINGS.PATH.POSTS).set('Authorization', process.env.AUTH_HEADER || '').send({
                blogId: blog.id,
                title: `valid title ${i}`,
                content: `content valid post ${i}`,
                shortDescription: `post ${i} short description valid`,
            });

            posts.push(response.body);
        }
        return posts;
    }
}