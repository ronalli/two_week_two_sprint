import {ObjectId} from "mongodb";
import {ResultCode} from "../types/resultCode";
import {CommentModel} from "./domain/comment.entity";
import {mappingComments} from "../common/utils/mappingComments";
import {LikeModel} from "./domain/like.entity";
import {ILikesInfoViewModel} from "./types/likes-info-types";
import {injectable} from "inversify";

@injectable()
export class CommentsQueryRepositories {
    async getComment(id: string, status: string) {
        try {
            const currentComment = await CommentModel.findOne({_id: new ObjectId(id)})

            if (currentComment) {

                const likesInfo: ILikesInfoViewModel = {
                    likesCount: currentComment.likesCount,
                    dislikesCount: currentComment.dislikesCount,
                    myStatus: status
                }

                return {
                    status: ResultCode.Success,
                    data: mappingComments.formatCommentForView(currentComment, likesInfo)
                }

            }
            return {errorMessage: 'Not found comment', status: ResultCode.NotFound, data: null}

        } catch (e) {
            return {errorMessage: 'Error BD', status: ResultCode.InternalServerError, data: null}
        }
    }

    async getCommentById(id: string) {
        try {
            const findComment = await CommentModel.findOne({_id: new ObjectId(id)});

            if (findComment) {
                return {
                    status: ResultCode.Success,
                    data: mappingComments.formatDataCommentForView(findComment)
                }
            }
            return {errorMessage: 'Not found comment', status: ResultCode.NotFound, data: null}
        } catch (e) {
            return {errorMessage: 'Error BD', status: ResultCode.InternalServerError, data: null}
        }
    }

    async getCurrentLike(parentId: string, userId: string) {
        const response = await LikeModel.findOne(({
            $and: [{userId: userId}, {parentId: parentId}]
        }))

        if (response) {
            return response;
        }

        return response;
    }
}