import {servicePosts} from "./servicePosts";
import {req} from "../test-helpers";
import {HTTP_STATUSES, SETTINGS} from "../../src/settings";
import {serviceLogin} from "./serviceRegistration";
import {testSeeder} from "./test.seeder";
import {ICommentViewModel} from "../../src/comments/types/comments-types";

export const serviceComments = {
    createComment: async (): Promise<ICommentViewModel> => {
        const post = await servicePosts.createPost();
        const jwtToken = await serviceLogin.user();

        const comment = testSeeder.createCommentDto()

        const response = await req.post(SETTINGS.PATH.POSTS + `/${post.id}/comments`).set(jwtToken).send(comment).expect(HTTP_STATUSES.Created)

        return response.body;
    },

    createComments: async (count: number) => {
        const post = await servicePosts.createPost();
        const jwtToken = await serviceLogin.user();

        const comments: ICommentViewModel[] = [];

        for (let i = 0; i < count; i++) {
            const response = await req.post(SETTINGS.PATH.POSTS + `/${post.id}/comments`).set(jwtToken).send({
                'content': `comment valid testing ${i}`,
            }).expect(HTTP_STATUSES.Created)

            comments.push(response.body);
        }

        return comments;
    }
}