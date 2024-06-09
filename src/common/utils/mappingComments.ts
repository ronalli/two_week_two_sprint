import {ICommentDBType, ICommentViewModel} from "../../comments/types/comments-types";
import {ILikesInfoViewModel} from "../../comments/types/likes-info-types";
import {LikeModel, LikeStatus} from "../../comments/domain/like.entity";

export const mappingComments = {
    formatDataCommentForView: (comment: ICommentDBType, ): Omit<ICommentViewModel, "likesInfo"> => {
        return {
            id: String(comment._id),
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin,
            },
            createdAt: comment.createdAt,
            content: comment.content,
        }
    },
    formatDataAllCommentsForView: async (comments: ICommentDBType[], currentUser: string | null): Promise<ICommentViewModel[]> => {

        const result: ICommentViewModel[] = []

        for (const comment of comments) {
            const likesCount = await LikeModel.find({
                $and: [{parentId: comment._id}, {status: LikeStatus.Like}]
            }).countDocuments()

            const dislikesCount = await LikeModel.find({
                $and: [{parentId: comment._id}, {status: LikeStatus.Dislike}]
            }).countDocuments()

            const currentStatus = await LikeModel.findOne({$and: [{parentId: comment._id}, {userId: currentUser}]});

            const likesInfo: ILikesInfoViewModel = {
                likesCount,
                dislikesCount,
                myStatus: currentStatus?.status ? currentStatus.status : 'None'
            }

            result.push(mappingComments.formatCommentForView(comment, likesInfo));
        }
        return result;
    },

    formatCommentForView: (comment: ICommentDBType, likesInfo: ILikesInfoViewModel): ICommentViewModel => {
        return {
            id: String(comment._id),
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin,
            },
            createdAt: comment.createdAt,
            content: comment.content,
            likesInfo
        }
    },
}