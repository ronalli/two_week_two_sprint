import {ICommentDBType, ICommentViewModel} from "../../comments/types/comments-types";

export const mappingComments = {
    formatDataCommentForView: (comment: ICommentDBType): ICommentViewModel => {
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
    formatDataAllCommentsForView: (comments: ICommentDBType[]): ICommentViewModel[] => {
        return comments.map(c => mappingComments.formatDataCommentForView(c))
    }
}