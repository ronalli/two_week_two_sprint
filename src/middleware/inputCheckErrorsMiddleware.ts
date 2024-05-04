import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";
import {HTTP_STATUSES} from "../settings";
import {formatingDataErrors} from "../utils/formatingOutputErrors";

export const inputCheckErrorsMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({onlyFirstError: true})
    if (errors.length > 0) {
        res.status(HTTP_STATUSES.BadRequest).send(formatingDataErrors(errors))
        return;
    }
    next();
}

export const inputCheckCorrectBlogIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({onlyFirstError: true})
    if (errors.length > 0) {
        res.status(HTTP_STATUSES.NotFound).send(formatingDataErrors(errors))
        return;
    }
    next();
}