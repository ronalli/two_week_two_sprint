import {OutputErrorsType} from "../types/output-errors-type";
import {ValidationError} from "express-validator";

export const formatingDataErrors = (array: ValidationError[]) => {
    const errors: OutputErrorsType = {
        errorsMessages: []
    }
    array.map(item => {
        if (item.type !== "unknown_fields") {
            if (item.type !== "alternative_grouped") {
                if (item.type !== "alternative") {
                    errors.errorsMessages.push({message: item.msg, field: item.path})
                }
            }
        }
    });
    return errors;
}