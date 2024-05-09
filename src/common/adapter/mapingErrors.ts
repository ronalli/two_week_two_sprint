import {ErrorsType, OutputErrorsType} from "../../types/output-errors-type";

export const mapingErrors = {
    outputResponse: (data: ErrorsType): OutputErrorsType => {
        const {message, field} = data;
        return {
            errorsMessages: [{
                message,
                field
            }]
        }
    }
}