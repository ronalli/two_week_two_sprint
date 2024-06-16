import {createDefaultValues} from "../utils/helper";
import {ObjectId} from "mongodb";
import {IPostQueryType} from "./types/request-response-type";
import {ResultCode} from "../types/resultCode";
import { PostModel} from "./domain/post.entity";
import {injectable} from "inversify";
import {mappingPosts} from "../common/utils/mappingPosts";

@injectable()
export class PostsQueryRepositories {

    async getPosts(queryParams: IPostQueryType, currentUser: string | null) {
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
                    items: await mappingPosts.formatingAllPostForView(allPosts, currentUser)
                }
            }

        } catch (e) {
            return {errorMessage: 'Error DB', status: ResultCode.InternalServerError, data: null}
        }
    }

    async getPostById(id: string) {
        try {
            const foundPost = await PostModel.findOne({_id: new ObjectId(id)});
            if (foundPost) {
                return {
                    status: ResultCode.Success,
                    data: foundPost
                }
            }
            return {errorMessage: 'Not found post', status: ResultCode.NotFound, data: null}
        } catch (e) {
            return {errorMessage: 'Error DB', status: ResultCode.InternalServerError, data: null}
        }
    }
}