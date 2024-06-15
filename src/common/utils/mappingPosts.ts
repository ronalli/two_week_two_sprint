import {IPostDBType, IPostViewModel} from "../../posts/types/posts-types";
import {IPostTypeDB} from "../../posts/domain/post.entity";
import {LikeModel} from "../../comments/domain/like.entity";

export const mappingPosts = {
    async formatingAllPostForView(posts: IPostTypeDB[], user: string | null) {

        const result: IPostViewModel[] = [];

        for(const post of posts) {

            const viewPost = await mappingPosts.formatingDataForOutputPost(post, user)

            result.push(viewPost);
        }

        return result;
    },

    async formatingDataForOutputPost(post: IPostTypeDB, user: string | null): Promise<IPostViewModel> {
        const currentStatus = await LikeModel.findOne({
            $and: [{parentId: post._id}, {userId: user}]
        })

        const lastLikes = await LikeModel.find({$and: [{parentId: post._id}, {userId: user}]}).sort({createdAt: -1}).limit(3).select('-parentId -status')

        const likesInfo = {
            likesCount: post.likesCount,
            dislikesCount: post.dislikesCount,
            myStatus: currentStatus?.status ? currentStatus.status : 'None',
            newestLikes: lastLikes

        }

        return {
            id: String(post._id),
            blogId: post.blogId,
            content: post.content,
            createdAt: post.createdAt,
            shortDescription: post.shortDescription,
            blogName: post.blogName,
            title: post.title,
            extendedLikesInfo: likesInfo
        };

    },
}