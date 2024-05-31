import {ObjectId} from "mongodb";
import {blogsQueryRepositories} from "../blogs/blogsQueryRepositories";
import {postsQueryRepositories} from "./postsQueryRepositories";
import {IPostDBType, IPostInputModel} from "./types/posts-types";
import {ResultCode} from "../types/resultCode";
import {PostModel} from "./domain/post.entity";

export const postsMongoRepositories = {
    create: async (postData: IPostInputModel) => {
        const findBlog = await blogsQueryRepositories.findBlogById(postData.blogId);

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
                        data: postsQueryRepositories._formatingDataForOutputPost(foundPost)
                    }
                }
                return {errorMessage: 'Something went wrong', status: ResultCode.BadRequest, data: null}
            } catch (e) {
                return {errorMessage: 'Error BD', status: ResultCode.InternalServerError, data: null}
            }
        }
        return {errorMessage: 'Not found blog', status: ResultCode.NotFound}
    },
    update: async (id: string, updatePost: IPostInputModel) => {

        const {content, blogId, shortDescription, title} = updatePost;

        try {
            // const findPost = await postsCollection.findOne({_id: new ObjectId(id)});

            const findPost = await PostModel.findOne({_id: new ObjectId(id)});
            if (findPost) {

                findPost.title = title;
                findPost.content = content;
                findPost.shortDescription = shortDescription;
                findPost.blogId = blogId;

                await findPost.save();

                // await postsCollection.findOneAndUpdate({_id: new ObjectId(id)}, {
                //     $set: {
                //         title: updatePost.title,
                //         content: updatePost.content,
                //         shortDescription: updatePost.shortDescription,
                //         blogId: updatePost.blogId
                //     }
                // })
                return {status: ResultCode.NotContent, data: null}
            }
            return {errorMessage: 'Not found post', status: ResultCode.NotFound, data: null}
        } catch (e) {
            return {errorMessage: 'Error BD', status: ResultCode.InternalServerError, data: null}
        }

    },
    delete: async (id: string) => {
        // const findDeletePost = await postsCollection.findOne({_id: new ObjectId(id)});

        const findDeletePost = await PostModel.findOne({_id: new ObjectId(id)});

        if (findDeletePost) {
            await PostModel.deleteOne({_id: new ObjectId(id)});
            return {status: ResultCode.NotContent, data: null}
        }
        return {errorMessage: 'Not found post', status: ResultCode.NotFound, data: null}
    },
}