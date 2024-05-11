import {req} from "../test-helpers";
import {HTTP_STATUSES, SETTINGS} from "../../src/settings";
import {testSeeder} from "./test.seeder";
import {IBlogInputModel, IBlogViewModel} from "../../src/blogs/types/blogs-types";

export const serviceBlogs = {
    createBlog: async (): Promise<IBlogViewModel> => {

        const response = await req.post(SETTINGS.PATH.BLOGS).set('Authorization', process.env.AUTH_HEADER || '').send(testSeeder.createBlogDto()).expect(HTTP_STATUSES.Created)

        return response.body
    },

    createBlogs: async (count: number) => {
        const blogs: IBlogInputModel[] = [];

        for(let i = 0; i < count; i++) {
            const response = await req.post(SETTINGS.PATH.BLOGS).set('Authorization', process.env.AUTH_HEADER || '').send({
                name: `testing ${i}`,
                description: `description testing ${i}`,
                websiteUrl: `https://it-incubator${i}.com`,
            }).expect(HTTP_STATUSES.Created)

            blogs.push(response.body);
        }

        return blogs;
    }
}