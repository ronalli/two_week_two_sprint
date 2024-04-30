import {Request, Response} from "express";
import {jwtService} from "../utils/jwt-services";
import {commentsServices} from "./commentsServices";


export const commentsController = {
    addComment: async (req: Request, res: Response) => {
        // const {postId} = req.params;
        // const {content} = req.body;
        // const token = req.headers.authorization!.split(' ')[1];
        // const userId = await jwtService.getUserIdByToken(token);
        //
        // console.log(postId, content, userId)
        //
        // const newComment = await commentsServices.add()
    },
    getComment: async (req: Request, res: Response) => {

    },
    updateComment: async (req: Request, res: Response) => {},
    deleteComment: async (req: Request, res: Response) => {}
}