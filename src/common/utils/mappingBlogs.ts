import {IBlogDBType, IBlogViewModel} from "../../blogs/types/blogs-types";

export const mappingBlogs = {
    formatingDataForOutputBlog(input: IBlogDBType): IBlogViewModel {
        return {
            id: String(input._id),
            name: input.name,
            description: input.description,
            websiteUrl: input.websiteUrl,
            createdAt: input.createdAt,
            isMembership: input.isMembership,
        };
    }
}