import {IUserQueryType} from "./types/request-response-type";
import {IUserDBType, IUserViewModel} from "./types/user-types";
import {ObjectId, SortDirection} from "mongodb";
import {ResultCode} from "../types/resultCode";
import {UserModel} from "./domain/user.entity";

export class UsersQueryRepositories {
    async getUsers(queryParams: IUserQueryType) {
        const query = this._createDefaultValues(queryParams);
        //!!!! -> utils
        let search: {};
        if (query.searchLoginTerm && query.searchEmailTerm) {
            search = {
                $or: [
                    {email: {$regex: `${query.searchEmailTerm}`, $options: "i"}},
                    {login: {$regex: `${query.searchLoginTerm}`, $options: "i"}},
                ]
            }
        } else if (query.searchLoginTerm) {
            search = {login: {$regex: `${query.searchLoginTerm}`, $options: "i"}}
        } else if (query.searchEmailTerm) {
            search = {email: {$regex: `${query.searchEmailTerm}`, $options: "i"}}
        } else {
            search = {};
        }

        const filter = {
            ...search
        }
        try {
            const allUsers = await UserModel
                .find(filter)
                .sort({[query.sortBy]: query.sortDirection})
                .skip((query.pageNumber - 1) * query.pageSize)
                .limit(query.pageSize)

            const totalCount = await UserModel.countDocuments(filter);
            return {
                status: ResultCode.Success,
                data: {
                    pagesCount: Math.ceil(totalCount / query.pageSize),
                    pageSize: query.pageSize,
                    page: query.pageNumber,
                    totalCount,
                    items: this._maping(allUsers)
                }
            }
        } catch (e) {
            return {errorMessage: 'Error BD', status: ResultCode.InternalServerError, data: null};
        }
    }

    async findUserById(id: string) {
        try {
            const foundUser = await UserModel.findOne({_id: new ObjectId(id)})
            if (foundUser) {
                return {status: ResultCode.Success, data: foundUser};
            }
            return {errorMessage: 'Not found user', status: ResultCode.NotFound, data: null}

        } catch (e) {
            return {errorMessage: 'Error DB', status: ResultCode.InternalServerError, data: null};
        }
    }

    async doesExistByLoginOrEmail(login: string, email: string) {
        try {

            const filter = {
                $or: [{login: login}, {email: email}]
            }
            const user = await UserModel.findOne(filter);

            if (user) {
                return {
                    message: 'User founded',
                    status: ResultCode.BadRequest,
                    field: user.login === login ? 'login' : 'email'
                }
            } else {
                return {status: ResultCode.Success, data: null}
            }
        } catch (e) {
            return {message: 'Error DB', status: ResultCode.InternalServerError, field: 'DB'};
        }
    }

    async findUserByCodeConfirmation(codeConfirmation: string) {
        try {
            const filter = {'emailConfirmation.confirmationCode': codeConfirmation}
            const user = await UserModel.findOne(filter);
            if (user) {
                return {status: ResultCode.Success, data: user}
            }
            return {message: 'User not found', status: ResultCode.BadRequest, field: 'code'}
        } catch (e) {
            return {message: 'Error DB', status: ResultCode.InternalServerError, field: 'DB'}
        }
    }

    _maping(users: IUserDBType[]): IUserViewModel[] {
        return users.map(u => ({
            id: String(u._id),
            createdAt: u.createdAt,
            email: u.email,
            login: u.login,
        }))
    }

    _createDefaultValues(query: IUserQueryType) {
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


// export const usersQueryRepositories = {
//     getUsers: async (queryParams: IUserQueryType) => {
//         const query = usersQueryRepositories._createDefaultValues(queryParams);
//
//         //!!!! -> utils
//         let search: {};
//         if (query.searchLoginTerm && query.searchEmailTerm) {
//             search = {
//                 $or: [
//                     {email: {$regex: `${query.searchEmailTerm}`, $options: "i"}},
//                     {login: {$regex: `${query.searchLoginTerm}`, $options: "i"}},
//                 ]
//             }
//         } else if (query.searchLoginTerm) {
//             search = {login: {$regex: `${query.searchLoginTerm}`, $options: "i"}}
//         } else if (query.searchEmailTerm) {
//             search = {email: {$regex: `${query.searchEmailTerm}`, $options: "i"}}
//         } else {
//             search = {};
//         }
//
//         const filter = {
//             ...search
//         }
//
//         try {
//             const allUsers = await UserModel
//                 .find(filter)
//                 .sort({[query.sortBy]: query.sortDirection})
//                 .skip((query.pageNumber - 1) * query.pageSize)
//                 .limit(query.pageSize)
//
//             const totalCount = await UserModel.countDocuments(filter);
//
//             return {
//                 status: ResultCode.Success,
//                 data: {
//                     pagesCount: Math.ceil(totalCount / query.pageSize),
//                     pageSize: query.pageSize,
//                     page: query.pageNumber,
//                     totalCount,
//                     items: usersQueryRepositories._maping(allUsers)
//                 }
//             }
//
//         } catch (e) {
//             return {errorMessage: 'Error BD', status: ResultCode.InternalServerError, data: null};
//         }
//     },
//     findUserById: async (id: string) => {
//         try {
//
//             const foundUser = await UserModel.findOne({_id: new ObjectId(id)})
//             if (foundUser) {
//                 return {status: ResultCode.Success, data: foundUser};
//             }
//             return {errorMessage: 'Not found user', status: ResultCode.NotFound, data: null}
//
//         } catch (e) {
//             return {errorMessage: 'Error DB', status: ResultCode.InternalServerError, data: null};
//         }
//     },
//
//     doesExistByLoginOrEmail: async (login: string, email: string) => {
//         try {
//
//             const filter = {
//                 $or: [{login: login}, {email: email}]
//             }
//
//             const user = await UserModel.findOne(filter);
//
//
//             if (user) {
//                 return {
//                     message: 'User founded',
//                     status: ResultCode.BadRequest,
//                     field: user.login === login ? 'login' : 'email'
//                 }
//             } else {
//                 return {status: ResultCode.Success, data: null}
//             }
//         } catch (e) {
//             return {message: 'Error DB', status: ResultCode.InternalServerError, field: 'DB'};
//         }
//     },
//     findUserByCodeConfirmation: async (codeConfirmation: string) => {
//         try {
//
//             const filter = {'emailConfirmation.confirmationCode': codeConfirmation}
//
//             const user = await UserModel.findOne(filter);
//
//             if (user) {
//                 return {status: ResultCode.Success, data: user}
//             }
//             return {message: 'User not found', status: ResultCode.BadRequest, field: 'code'}
//         } catch (e) {
//             return {message: 'Error DB', status: ResultCode.InternalServerError, field: 'DB'}
//         }
//
//     },
//     _maping: (users: IUserDBType[]): IUserViewModel[] => {
//         return users.map(u => ({
//             id: String(u._id),
//             createdAt: u.createdAt,
//             email: u.email,
//             login: u.login,
//         }))
//     },
//     _createDefaultValues: (query: IUserQueryType) => {
//         return {
//             pageNumber: query.pageNumber ? +query.pageNumber : 1,
//             pageSize: query.pageSize !== undefined ? +query.pageSize : 10,
//             sortBy: query.sortBy ? query.sortBy : "createdAt",
//             sortDirection: query.sortDirection ? query.sortDirection as SortDirection : "desc",
//             searchLoginTerm: query.searchLoginTerm ? query.searchLoginTerm : null,
//             searchEmailTerm: query.searchEmailTerm ? query.searchEmailTerm : null,
//         }
//     }
// }