import {usersQueryRepositories} from "./usersQueryRepositories";
import {Request, Response} from "express";
import {HTTP_STATUSES} from "../settings";
import {IUserQueryType} from "./types/request-response-type";
import {IUserInputModel} from "./types/user-types";
import {usersServices} from "./usersServices";

export const usersController = {
    getAllUsers: async (req: Request, res: Response) => {
        const queryParams: IUserQueryType = req.query;
        const result = await usersQueryRepositories.getUsers(queryParams);
        if(result.data) {
            res.status(HTTP_STATUSES[result.status]).json(result.data)
            return
        }
        res.status(HTTP_STATUSES[result.status]).send({errorMessage: result.errorMessage, data: result.data})
    },
    createUser: async (req: Request, res: Response)=> {
        const inputData: IUserInputModel = req.body;
        const result = await usersServices.createUser(inputData);
        if (result.data) {
            res.status(HTTP_STATUSES[result.status]).send(result.data);
            return
        }
        res.status(HTTP_STATUSES[result.status]).send({errorMessage: result.errorMessage, data: result.data})
        return

    },
    deleteUser: async (req: Request, res: Response) => {
        const {id} = req.params;
        const result = await usersServices.deleteUser(id)

        if(result.errorMessage) {
            res.status(HTTP_STATUSES[result.status]).send({errorMessage: result.errorMessage, data: result.data})
            return
        }
        res.status(HTTP_STATUSES[result.status]).send({})
        return
    },
}