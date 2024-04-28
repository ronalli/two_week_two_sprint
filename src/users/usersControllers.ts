import {usersQueryRepositories} from "./usersQueryRepositories";
import {Request, Response} from "express";
import {HTTP_STATUSES} from "../settings";
import {IUserQueryType} from "./types/request-response-type";
import {IUserInputModel, IUserViewModel} from "./types/user-types";
import {usersServices} from "./usersServices";

export const usersController = {
    getAllUsers: async (req: Request, res: Response) => {
        const queryParams: IUserQueryType = req.query;
        const allUsers = await usersQueryRepositories.getUsers(queryParams);
        res.status(HTTP_STATUSES.OK_200).json(allUsers)
    },
    createUser: async (req: Request, res: Response): Promise<IUserViewModel | undefined> => {
        const inputData: IUserInputModel = req.body;
        const createdUser = await usersServices.createUser(inputData);
        if (createdUser) {
            res.status(HTTP_STATUSES.CREATED_201).send(createdUser);
            return;
        }
        res.status(HTTP_STATUSES.BED_REQUEST_400).send({})
        return;

    },
    deleteUser: async (req: Request, res: Response) => {
        const {id} = req.params;
        const success = await usersServices.deleteUser(id)
        if (success) {
            res.status(HTTP_STATUSES.NO_CONTENT_204).send({})
            return
        }
        res.status(HTTP_STATUSES.NOT_FOUND_404).send({})
        return
    }
}