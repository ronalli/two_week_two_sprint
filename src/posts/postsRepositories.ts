import {ObjectId} from "mongodb";
import {PostsQueryRepositories} from "./postsQueryRepositories";
import {IPostDBType, IPostInputModel} from "./types/posts-types";
import {ResultCode} from "../types/resultCode";
import {PostModel} from "./domain/post.entity";
import {BlogsQueryRepositories} from "../blogs/blogsQueryRepositories";

export class PostsRepositories {

    constructor(protected blogsQueryRepositories: BlogsQueryRepositories, protected postsQueryRepositories: PostsQueryRepositories) {
    }

    async create(postData: IPostInputModel) {
        const findBlog = await this.blogsQueryRepositories.findBlogById(postData.blogId);

        if (findBlog.data) {

            let newPost: IPostDBType = {
                ...postData,
                blogName: findBlog.data.name,
                createdAt: new Date().toISOString(),
            }

            const post = new PostModel(newPost);
            const response = await post.save();

            try {
                const foundPost = await PostModel.findOne({_id: response._id});
                if (foundPost) {
                    return {
                        status: ResultCode.Created,
                        data: this.postsQueryRepositories._formatingDataForOutputPost(foundPost)
                    }
                }
                return {errorMessage: 'Something went wrong', status: ResultCode.BadRequest, data: null}
            } catch (e) {
                return {errorMessage: 'Error BD', status: ResultCode.InternalServerError, data: null}
            }
        }
        return {errorMessage: 'Not found blog', status: ResultCode.NotFound}
    }

    async update(id: string, updatePost: IPostInputModel) {

        const {content, blogId, shortDescription, title} = updatePost;

        try {
            const findPost = await PostModel.findOne({_id: new ObjectId(id)});
            if (findPost) {

                findPost.title = title;
                findPost.content = content;
                findPost.shortDescription = shortDescription;
                findPost.blogId = blogId;

                await findPost.save();

                return {status: ResultCode.NotContent, data: null}
            }
            return {errorMessage: 'Not found post', status: ResultCode.NotFound, data: null}
        } catch (e) {
            return {errorMessage: 'Error BD', status: ResultCode.InternalServerError, data: null}
        }

    }

    async delete(id: string) {

        const findDeletePost = await PostModel.findOne({_id: new ObjectId(id)});

        if (findDeletePost) {
            await PostModel.deleteOne({_id: new ObjectId(id)});
            return {status: ResultCode.NotContent, data: null}
        }
        return {errorMessage: 'Not found post', status: ResultCode.NotFound, data: null}
    }
}