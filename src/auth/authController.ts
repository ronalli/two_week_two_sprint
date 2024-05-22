import {Request, Response} from 'express';
import {ILoginBody} from "./types/login-types";
import {authService} from "./authService";
import {HTTP_STATUSES} from "../settings";
import {usersServices} from "../users/usersServices";
import {IUserDBType} from "../users/types/user-types";
import {IMeViewModel} from "./types/me-types";
import {IUserInputModelRegistration} from "./types/registration-type";
import {mapingErrors} from "../common/adapter/mapingErrors";
import {mappingRequestHeaders} from "../common/utils/mappingRequestHeaders";

export const authController = {
    login: async (req: Request, res: Response) => {

        // undefined
        // PostmanRuntime/7.37.3
        //     ::1
        //     ::1
        // undefined

        const dataSession = mappingRequestHeaders.getHeadersForCreateSession(req)



        const authData: ILoginBody = req.body;
        const result = await authService.login(authData, dataSession);
        if (result.data) {

            res.cookie('refreshToken', result.data.refreshToken,  {httpOnly: true, secure: true});
            res.status(HTTP_STATUSES[result.status]).send({"accessToken": result.data.accessToken})
            return
        }
        res.status(HTTP_STATUSES[result.status]).send({errorMessage: result.errorMessage, data: result.data})
        return
    },

    me: async (req: Request, res: Response) => {
        const userId = req.userId!;
        if (userId !== null) {
            const result = await usersServices.findUser(userId);
            if (result.data) {
                const outputResult = authController._maping(result.data);
                res.status(HTTP_STATUSES[result.status]).send(outputResult)
                return
            }
            res.status(HTTP_STATUSES[result.status]).send({errorMessage: result.errorMessage, data: result.data})
            return
        }
        res.status(HTTP_STATUSES.BadRequest).send({errorMessage: "Something went wrong", data: null})
        return
    },

    registration: async (req: Request, res: Response) => {
        const data: IUserInputModelRegistration = req.body
        const result = await authService.registration(data);
        if (result.errorMessage) {
            res.status(HTTP_STATUSES[result.status]).send(mapingErrors.outputResponse(result.errorMessage))
            return
        }
        res.status(HTTP_STATUSES[result.status]).send({})
        return
    },

    confirmationEmail: async (req: Request, res: Response) => {
        const {code} = req.body
        const result = await authService.confirmEmail(code)
        if (result.errorMessage) {
            res.status(HTTP_STATUSES[result.status]).send(mapingErrors.outputResponse(result.errorMessage))
            return
        }
        res.status(HTTP_STATUSES[result.status]).send({})
        return
    },
    resendConfirmationCode: async (req: Request, res: Response) => {
        const {email} = req.body;
        const result = await authService.resendCode(email);

        if (result.errorMessage) {
            res.status(HTTP_STATUSES[result.status]).send(mapingErrors.outputResponse(result.errorMessage))
            return
        }
        res.status(HTTP_STATUSES[result.status]).send({})
        return

    },

    logout: async (req: Request, res: Response) => {
        const cookie = req.cookies.refreshToken;

        if(!cookie) {
            res.status(HTTP_STATUSES.Unauthorized).send({})
            return
        }

        const response = await authService.logout(cookie);

        res.status(HTTP_STATUSES[response.status]).send({})
        return

    },

    refreshToken: async (req: Request, res: Response) => {
        const cookie = req.cookies.refreshToken;

        if(!cookie) {
            res.status(HTTP_STATUSES.Unauthorized).send({})
            return
        }

        const response = await authService.refreshToken(cookie)

        if(response.data) {

            res.cookie('refreshToken', response.data.refreshToken, {httpOnly: true, secure: true})
            res.status(HTTP_STATUSES[response.status]).send({'accessToken': response.data.accessToken})
            return
        }

        res.status(HTTP_STATUSES[response.status]).send(response.errorMessage)
        return

    },

    _maping
    (user: IUserDBType): IMeViewModel {
        return {
            userId: String(user._id),
            email: user.email,
            login: user.login,
        }
    }
}