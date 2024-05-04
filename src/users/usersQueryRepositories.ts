import {IUserQueryType} from "./types/request-response-type";
import {IPaginatorUserViewModel, IUserDBType, IUserViewModel} from "./types/user-types";
import {usersCollection} from "../db/mongo-db";
import {ObjectId, SortDirection} from "mongodb";
import {ResultCode} from "../types/resultCode";

export const usersQueryRepositories = {
    getUsers: async (queryParams: IUserQueryType) => {
        const query = usersQueryRepositories._createDefaultValues(queryParams);
        let search = {};
        if(query.searchLoginTerm && query.searchEmailTerm) {
            search = {
                $or: [
                    {email: {$regex: `${query.searchEmailTerm}`, $options: "i"}},
                    {login: {$regex: `${query.searchLoginTerm}`, $options: "i"}},
                ]
            }
        } else if(query.searchLoginTerm) {
            search = {login: {$regex: `${query.searchLoginTerm}`, $options: "i"}}
        } else if(query.searchEmailTerm) {
            search = {email: {$regex: `${query.searchEmailTerm}`, $options: "i"}}
        } else {
            search = {};
        }

        const filter = {
            ...search
        }

        try {
            const allUsers = await usersCollection
                .find(filter ? filter : '')
                .sort(query.sortBy, query.sortDirection)
                .skip((query.pageNumber - 1) * query.pageSize)
                .limit(query.pageSize)
                .toArray();

            const totalCount = await usersCollection.countDocuments(filter);

            return {
                status: ResultCode.Success,
                items: {
                    pagesCount: Math.ceil(totalCount/ query.pageSize),
                    pageSize: query.pageSize,
                    page: query.pageNumber,
                    totalCount,
                    items: usersQueryRepositories._maping(allUsers)
                }
            }

        } catch (e) {
            return {error: 'Error BD', status: ResultCode.BadRequest};
        }
    },
    findUserById: async (id: string) => {
        try {
            const foundUser = await usersCollection.findOne({_id: new ObjectId(id)})
            if(foundUser) {
                return {status: ResultCode.Success, item: foundUser };
            }
            return {error: 'Not found user', status: ResultCode.NotFound}

        } catch (e) {
            return {error: 'Error DB', status: ResultCode.BadRequest};
        }
    },

    _maping: (users: IUserDBType[]): IUserViewModel[] => {
        return users.map(u => ({
            id: String(u._id),
            createdAt: u.createdAt,
            email: u.email,
            login: u.login,
        }))
    },
    _createDefaultValues: (query: IUserQueryType) => {
        return {
            pageNumber: query.pageNumber ? +query.pageNumber : 1,
            pageSize: query.pageSize !== undefined ? +query.pageSize : 10,
            sortBy: query.sortBy ? query.sortBy : "createdAt",
            sortDirection: query.sortDirection ? query.sortDirection as SortDirection : "desc",
            searchLoginTerm: query.searchLoginTerm ? query.searchLoginTerm : null,
            searchEmailTerm: query.searchEmailTerm ? query.searchEmailTerm : null,
        }
    }
}