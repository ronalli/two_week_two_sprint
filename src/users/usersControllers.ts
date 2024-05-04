import {usersQueryRepositories} from "./usersQueryRepositories";
import {Request, Response} from "express";
import {HTTP_STATUSES} from "../settings";
import {IUserQueryType} from "./types/request-response-type";
import {IUserInputModel} from "./types/user-types";
import {usersServices} from "./usersServices";
import {ResultCode} from "../types/resultCode";

export const usersController = {
    getAllUsers: async (req: Request, res: Response) => {
        const queryParams: IUserQueryType = req.query;
        const result = await usersQueryRepositories.getUsers(queryParams);
        if(result.items) {
            res.status(HTTP_STATUSES.OK_200).json(result.items)
            return
        }
        if(result.status === ResultCode.BadRequest) {
            res.status(HTTP_STATUSES.BED_REQUEST_400).send({})
            return
        }
        res.status(HTTP_STATUSES.NOT_FOUND_404).send({})
    },
    createUser: async (req: Request, res: Response)=> {
        const inputData: IUserInputModel = req.body;
        const result = await usersServices.createUser(inputData);
        if (result.data) {
            res.status(HTTP_STATUSES.CREATED_201).send(result.data);
            return
        }

        if(result.status === ResultCode.BadRequest) {
            res.status(HTTP_STATUSES.BED_REQUEST_400).send({})
            return
        }

        res.status(HTTP_STATUSES.NOT_FOUND_404).send({})
        return

    },
    deleteUser: async (req: Request, res: Response) => {
        const {id} = req.params;
        const result = await usersServices.deleteUser(id)

        if(result.status === ResultCode.BadRequest) {
            res.status(HTTP_STATUSES.BED_REQUEST_400).send({})
            return
        }

        if (result.status === ResultCode.NotContent) {
            res.status(HTTP_STATUSES.NO_CONTENT_204).send({})
            return
        }

        res.status(HTTP_STATUSES.NOT_FOUND_404).send({})
        return
    },
}