import {Request, Response} from "express";
import {HTTP_STATUSES} from "../settings";
import {IUserQueryType} from "./types/request-response-type";
import {IUserInputModel} from "./types/user-types";
import {UsersServices} from "./usersServices";
import {UsersQueryRepositories} from "./usersQueryRepositories";
import {inject, injectable} from "inversify";

@injectable()
export class UserController {
    constructor(@inject(UsersServices) protected usersServices: UsersServices,@inject(UsersQueryRepositories) protected usersQueryRepositories: UsersQueryRepositories) {
    }

    async getAllUsers(req: Request, res: Response) {
        const queryParams: IUserQueryType = req.query;
        const result = await this.usersQueryRepositories.getUsers(queryParams);
        if (result.data) {
            res.status(HTTP_STATUSES[result.status]).json(result.data)
            return
        }
        res.status(HTTP_STATUSES[result.status]).send({errorMessage: result.errorMessage, data: result.data})
    }

    async createUser(req: Request, res: Response) {
        const inputData: IUserInputModel = req.body;
        const result = await this.usersServices.createUser(inputData);
        if (result.data) {
            res.status(HTTP_STATUSES[result.status]).send(result.data);
            return
        }
        res.status(HTTP_STATUSES[result.status]).send({errorMessage: result.errorMessage, data: result.data})
        return
    }

    async deleteUser(req: Request, res: Response) {
        const {id} = req.params;
        const result = await this.usersServices.deleteUser(id)

        if (result.errorMessage) {
            res.status(HTTP_STATUSES[result.status]).send({errorMessage: result.errorMessage, data: result.data})
            return
        }
        res.status(HTTP_STATUSES[result.status]).send({})
        return
    }
}