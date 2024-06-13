import {ICommentAdd, ICommentDBType} from "./types/comments-types";
import {ObjectId} from "mongodb";
import {ResultCode} from "../types/resultCode";
import {CommentDocument, CommentModel} from "./domain/comment.entity";
import {mappingComments} from "../common/utils/mappingComments";
import {UsersQueryRepositories} from "../users/usersQueryRepositories";
import {ILikeTypeDB, LikeModel, LikeStatus} from "./domain/like.entity";
import {ILikesInfoViewModel} from "./types/likes-info-types";
import {ICommentsQueryType} from "./types/output-paginator-comments-types";
import {createDefaultValuesQueryParams} from "../utils/helper";
import {inject, injectable} from "inversify";

@injectable()
export class CommentsRepositories {
    constructor(@inject(UsersQueryRepositories) protected usersQueryRepositories: UsersQueryRepositories) {
    }

    async updateComment(id: string, contentUpdate: string) {
        try {
            const findComment = await CommentModel.findOne({_id: new ObjectId(id)});
            if (findComment) {
                findComment.content = contentUpdate;
                await findComment.save();
                return {status: ResultCode.NotContent, data: null}
            }
            return {errorMessage: 'Not found comment', status: ResultCode.NotFound, data: null};
        } catch (e) {
            return {errorMessage: 'Error BD', status: ResultCode.InternalServerError, data: null}
        }
    }

    async deleteComment(id: string) {
        try {
            await CommentModel.deleteOne({_id: new ObjectId(id)});
            return {status: ResultCode.NotContent, data: null};
        } catch (e) {
            return {errorMessage: 'Error DB', status: ResultCode.InternalServerError, data: null};
        }
    }

    async addComment(data: ICommentAdd) {

        const result = await this.usersQueryRepositories.findUserById(data.userId)
        const dataComment: ICommentDBType = {
            postId: data.postId,
            content: data.content,
            createdAt: new Date().toISOString(),
            commentatorInfo: {
                userId: data.userId,
                userLogin: result.data!.login
            },
            likesCount: 0,
            dislikesCount: 0
        }
        try {
            const newComment = new CommentModel(dataComment);
            const response = await newComment.save();
            const comment = await CommentModel.findOne({_id: new ObjectId(response._id)});

            const likesInfo: ILikesInfoViewModel = {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: 'None'
            }

            if (comment) {
                const res = mappingComments.formatCommentForView(comment, likesInfo);
                return {status: ResultCode.Created, data: res}
            }
            return {errorMessage: 'Not found comment', status: ResultCode.NotFound, data: null};
        } catch (e) {
            return {errorMessage: 'Error DB', status: ResultCode.InternalServerError, data: null}
        }
    }

    async addStatusLike(data: Omit<ILikeTypeDB, 'createdAt'>) {
        const like = new LikeModel();

        like.userId = data.userId;
        like.parentId = data.parentId;
        like.status = data.status;
        like.createdAt = new Date().toISOString();

        await like.save();

        return like;
    }

    async updateStatusLike(data: Omit<ILikeTypeDB, 'createdAt'>, comment: CommentDocument) {

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

        currentStatus.status = data.status;
        if(data.status === LikeStatus.Like) {
            comment.likesCount += 1;
            comment.dislikesCount -= 1;
        } else {
            comment.likesCount -= 1;
            comment.dislikesCount += 1;
        }

        await comment.save();

        await currentStatus.save();

        return {status: ResultCode.NotContent, data: null}
    }

    async getCommentById(id: string) {
        return CommentModel.findOne({_id: new ObjectId(id)});
    }

    async getCommentsForSpecialPost(postId: string, queryParams: ICommentsQueryType, currentUser: string | null) {
        const query = createDefaultValuesQueryParams(queryParams);

        try {
            const filter = {postId: postId}
            const comments = await CommentModel.find(filter)
                .sort({[query.sortBy]: query.sortDirection})
                .skip((query.pageNumber - 1) * query.pageSize)
                .limit(query.pageSize)

            const totalCount = await CommentModel.countDocuments(filter);

            return {
                status: ResultCode.Success,
                data: {
                    pagesCount: Math.ceil(totalCount / query.pageSize),
                    pageSize: query.pageSize,
                    page: query.pageNumber,
                    totalCount,
                    items: await mappingComments.formatDataAllCommentsForView(comments, currentUser)
                }

            }
        } catch (e) {
            return {errorMessage: 'Error BD', status: ResultCode.InternalServerError, data: null}
        }
    }

    async getCurrentLike(parentId: string, userId: string) {
        return LikeModel.findOne(({
            $and: [{userId: userId}, {parentId: parentId}]
        }));

    }
}