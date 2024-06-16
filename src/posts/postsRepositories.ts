import {ObjectId} from "mongodb";
import {PostsQueryRepositories} from "./postsQueryRepositories";
import {IPostDBType, IPostInputModel, IPostViewModel} from "./types/posts-types";
import {ResultCode} from "../types/resultCode";
import {IPostTypeDB, PostDocument, PostModel} from "./domain/post.entity";
import {BlogsQueryRepositories} from "../blogs/blogsQueryRepositories";
import {inject, injectable} from "inversify";
import {LikeModel} from "../comments/domain/like.entity";
import {ILikeTypeDB, LikeStatus} from "../types/like.status-type";
import {ILikesInfoViewModel} from "../comments/types/likes-info-types";
import {mappingPosts} from "../common/utils/mappingPosts";

@injectable()
export class PostsRepositories {
    constructor(@inject(BlogsQueryRepositories) protected blogsQueryRepositories: BlogsQueryRepositories, @inject(PostsQueryRepositories) protected postsQueryRepositories: PostsQueryRepositories) {
    }

    async create(postData: IPostInputModel, currentUser: string) {
        const findBlog = await this.blogsQueryRepositories.findBlogById(postData.blogId);

        if (findBlog.data) {

            let newPost: IPostTypeDB = {
                ...postData,
                blogName: findBlog.data.name,
                createdAt: new Date().toISOString(),
                dislikesCount: 0,
                likesCount: 0
            }

            const post = new PostModel(newPost);
            const response = await post.save();

            try {
                const foundPost = await PostModel.findOne({_id: response._id});
                if (foundPost) {
                    return {
                        status: ResultCode.Created,
                        data: await mappingPosts.formatingDataForOutputPost(foundPost, currentUser)
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

    async getPost(id: string) {
        return PostModel.findOne({_id: id});
    }

    async getLike(postId: string, userId: string) {
        return LikeModel.findOne({
            $and: [{userId: userId}, {parentId: postId}]
        })
    }

    async addStatusLike(data: Omit<ILikeTypeDB, 'addedAt'>) {

        const like = new LikeModel({});

        like.userId = data.userId;
        like.parentId = data.parentId;
        like.status = data.status;
        like.addedAt = new Date().toISOString();
        like.login = data.login;

        await like.save();

        return like;

    }

    async updateStatusLike(data: Omit<ILikeTypeDB, 'addedAt'>, post: PostDocument) {

        const currentStatus = await LikeModel.findOne(({
            $and: [{userId: data.userId}, {parentId: data.parentId}]
        }))

        if (!currentStatus) {
            return {
                status: ResultCode.BadRequest, data: null, errorsMessages: [
                    {
                        "message": "Wrong",
                        "field": 'status'
                    }
                ]
            }
        }

        if (currentStatus.status === data.status) {
            return {status: ResultCode.NotContent, data: null}
        }


        if (data.status === LikeStatus.Like) {
            post.likesCount += 1;
            post.dislikesCount -= 1;
        } else if (data.status === LikeStatus.Dislike) {
            post.likesCount -= 1;
            post.dislikesCount += 1;
        } else {
            currentStatus.status === LikeStatus.Like ? post.likesCount -= 1 : post.dislikesCount -= 1;
        }
        currentStatus.status = data.status;

        await post.save();

        await currentStatus.save();

        return {status: ResultCode.NotContent, data: null}
    }

    async findPostById(id: string, currentUser: string) {
        try {
            const foundPost = await PostModel.findOne({_id: new ObjectId(id)});
            if (foundPost) {

                return {
                    status: ResultCode.Success,
                    data: mappingPosts.formatingDataForOutputPost(foundPost, currentUser)
                }
            }
            return {errorMessage: 'Not found post', status: ResultCode.NotFound, data: null}
        } catch (e) {
            return {errorMessage: 'Error DB', status: ResultCode.InternalServerError, data: null}
        }
    }

    // _formatingDataForOutputPost(input: IPostTypeDB, likeInfo: ILikesInfoViewModel): IPostViewModel {
    //     return {
    //         id: String(input._id),
    //         blogId: input.blogId,
    //         content: input.content,
    //         createdAt: input.createdAt,
    //         shortDescription: input.shortDescription,
    //         blogName: input.blogName,
    //         title: input.title,
    //         extendedLikesInfo: {
    //             likesCount: input.likesCount,
    //             dislikesCount: input.dislikesCount,
    //             myStatus: likeInfo.myStatus
    //         }
    //     };
    // }
}