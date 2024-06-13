import {createDefaultValues} from "../utils/helper";
import {ObjectId} from "mongodb";
import {IPostDBType, IPostViewModel} from "./types/posts-types";
import {IPostQueryType} from "./types/request-response-type";
import {ResultCode} from "../types/resultCode";
import {PostModel} from "./domain/post.entity";
import {injectable} from "inversify";

@injectable()
export class PostsQueryRepositories {
    async getPosts(queryParams: IPostQueryType) {
        const query = createDefaultValues(queryParams);
        try {
            const allPosts = await PostModel.find()
                .sort({[query.sortBy]: query.sortDirection})
                .skip((query.pageNumber - 1) * query.pageSize)
                .limit(query.pageSize)

            const totalCount = await PostModel.countDocuments();

            return {
                status: ResultCode.Success,
                data: {
                    pagesCount: Math.ceil(totalCount / query.pageSize),
                    page: query.pageNumber,
                    pageSize: query.pageSize,
                    totalCount,
                    items: allPosts.map(x => this._formatingDataForOutputPost(x))
                }

            }

        } catch (e) {
            return {errorMessage: 'Error DB', status: ResultCode.InternalServerError, data: null}
        }
    }

    async findPostById(id: string) {
        try {

            const foundPost = await PostModel.findOne({_id: new ObjectId(id)});
            if (foundPost) {
                return {
                    status: ResultCode.Success,
                    data: this._formatingDataForOutputPost(foundPost)
                }
            }
            return {errorMessage: 'Not found post', status: ResultCode.NotFound, data: null}
        } catch (e) {
            return {errorMessage: 'Error DB', status: ResultCode.InternalServerError, data: null}
        }
    }

    _formatingDataForOutputPost(input: IPostDBType): IPostViewModel {
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