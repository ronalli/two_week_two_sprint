import {IPostDBType, IPostViewModel} from "../../posts/types/posts-types";

export const mappingPosts = {
    formatingDataForOutputPost(input: IPostDBType): IPostViewModel {
        return {
            id: String(input._id),
            blogId: input.blogId,
            content: input.content,
            createdAt: input.createdAt,
            shortDescription: input.shortDescription,
            blogName: input.blogName,
            title: input.title,
        };
    }
}