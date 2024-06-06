import {Request, Response} from 'express';
import {ILoginBody} from "./types/login-types";
import {HTTP_STATUSES} from "../settings";
import {IUserDBType} from "../users/types/user-types";
import {IMeViewModel} from "./types/me-types";
import {IUserInputModelRegistration} from "./types/registration-type";
import {mapingErrors} from "../common/adapter/mapingErrors";
import {mappingRequestHeaders} from "../common/utils/mappingRequestHeaders";
import {AuthService} from "./authService";
import {UsersServices} from "../users/usersServices";

export class AuthController {
    private authService: AuthService
    private usersServices: UsersServices
    constructor() {
        this.authService = new AuthService()
        this.usersServices = new UsersServices()
    }

    async login(req: Request, res: Response) {

        const dataSession = mappingRequestHeaders.getHeadersForCreateSession(req)

        const authData: ILoginBody = req.body;
        const result = await this.authService.login(authData, dataSession);
        if (result.data) {

            res.cookie('refreshToken', result.data.refreshToken, {httpOnly: true, secure: true});
            res.status(HTTP_STATUSES[result.status]).send({"accessToken": result.data.accessToken})
            return
        }
        res.status(HTTP_STATUSES[result.status]).send({errorMessage: result.errorMessage, data: result.data})
        return
    }

    async me(req: Request, res: Response) {
        const userId = req.userId!;
        if (userId !== null) {
            const result = await this.usersServices.findUser(userId);
            if (result.data) {
                const outputResult = this._maping(result.data);
                res.status(HTTP_STATUSES[result.status]).send(outputResult)
                return
            }
            res.status(HTTP_STATUSES[result.status]).send({errorMessage: result.errorMessage, data: result.data})
            return
        }
        res.status(HTTP_STATUSES.BadRequest).send({errorMessage: "Something went wrong", data: null})
        return
    }

    async registration(req: Request, res: Response) {
        const data: IUserInputModelRegistration = req.body
        const result = await this.authService.registration(data);
        if (result.errorMessage) {
            res.status(HTTP_STATUSES[result.status]).send(mapingErrors.outputResponse(result.errorMessage))
            return
        }
        res.status(HTTP_STATUSES[result.status]).send({})
        return
    }

    async confirmationEmail(req: Request, res: Response) {
        const {code} = req.body
        const result = await this.authService.confirmEmail(code)
        if (result.errorMessage) {
            res.status(HTTP_STATUSES[result.status]).send(mapingErrors.outputResponse(result.errorMessage))
            return
        }
        res.status(HTTP_STATUSES[result.status]).send({})
        return
    }

    async resendConfirmationCode(req: Request, res: Response) {
        const {email} = req.body;
        const result = await this.authService.resendCode(email);

        if (result.errorMessage) {
            res.status(HTTP_STATUSES[result.status]).send(mapingErrors.outputResponse(result.errorMessage))
            return
        }
        res.status(HTTP_STATUSES[result.status]).send({})
        return
    }

    async logout(req: Request, res: Response) {
        const cookie = req.cookies.refreshToken;

        if (!cookie) {
            res.status(HTTP_STATUSES.Unauthorized).send({})
            return
        }

        const response = await this.authService.logout(cookie);

        res.status(HTTP_STATUSES[response.status]).send({})
        return
    }

    async refreshToken(req: Request, res: Response){
        const cookie = req.cookies.refreshToken;

        const response = await this.authService.refreshToken(cookie)

        if (response.data) {
            res.cookie('refreshToken', response.data.refreshToken, {httpOnly: true, secure: true})
            res.status(HTTP_STATUSES[response.status]).send({'accessToken': response.data.accessToken})
            return
        }

        res.status(HTTP_STATUSES[response.status]).send(response.errorMessage)
        return
    }

    async passwordRecovery(req: Request, res: Response){
        const {email} = req.body;

        const response = await this.authService.recoveryCode(email);

        res.status(HTTP_STATUSES.NotContent).send({})
        return;
    }

    async setNewPassword(req: Request, res: Response){
        const {newPassword, recoveryCode} = req.body;

        const response = await this.authService.checkValidRecoveryCode(recoveryCode)

        if (!response.data) {
            res.status(HTTP_STATUSES[response.status]).send({"errorsMessages": response.errorsMessages})
            return
        }
        await this.authService.updatePassword(newPassword, response.data)

        res.status(HTTP_STATUSES.NotContent).send({})
        return
    }

    _maping(user: IUserDBType): IMeViewModel {
        return {
            userId: String(user._id),
            email: user.email,
            login: user.login,
        }
    }
}

export const authController = new AuthController();