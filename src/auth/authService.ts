import {add} from 'date-fns'
import {randomUUID} from "node:crypto";
import {ILoginBody} from "./types/login-types";
import {bcryptService} from "../common/adapter/bcrypt.service";
import {ResultCode} from "../types/resultCode";
import {jwtService} from "../utils/jwt-services";
import {IUserInputModelRegistration} from "./types/registration-type";
import {nodemailerService} from "../common/adapter/nodemailer.service";
import {emailExamples} from "../common/adapter/emailExamples";
import {IUserDBType} from "../users/types/user-types";
import {ObjectId} from "mongodb";
import {UsersRepositories} from "../users/usersRepositories";
import {IHeadersSession} from "./types/sessions-types";
import {decodeToken} from "../common/utils/decodeToken";
import {UserModel} from "../users/domain/user.entity";
import {RefreshTokenModel} from "./domain/refreshToken.entity";
import {AuthQueryRepositories} from "./authQueryRepositories";
import {RecoveryCodeModel} from "./domain/recoveryCode.entity";
import {createRecoveryCode} from "../common/utils/createRecoveryCode";
import {AuthRepositories} from "./authRepositories";
import {UsersQueryRepositories} from "../users/usersQueryRepositories";
import {SecurityServices} from "../security/securityServices";
import {injectable} from "inversify";


@injectable()
export class AuthService {
    constructor(protected  authRepositories: AuthRepositories, protected authQueryRepositories: AuthQueryRepositories, protected usersRepositories: UsersRepositories, protected usersQueryRepositories: UsersQueryRepositories, protected securityServices: SecurityServices) {
    }

    async login(data: ILoginBody, dataSession: IHeadersSession) {
        const {loginOrEmail}: ILoginBody = data;
        const result = await this.authRepositories.findByLoginOrEmail(loginOrEmail)

        if (result.data) {

            const success = await bcryptService.checkPassword(data.password, result.data.hash);
            if (success) {

                const devicedId = randomUUID();

                const accessToken = await jwtService.createdJWT({
                    deviceId: devicedId,
                    userId: String(result.data._id)
                }, '1h')

                const refreshToken = await jwtService.createdJWT({
                    deviceId: devicedId,
                    userId: String(result.data._id)
                }, '2h')

                await this.securityServices.createAuthSessions(refreshToken, dataSession)

                return {status: ResultCode.Success, data: {accessToken, refreshToken}};
            } else {
                return {
                    status: ResultCode.Unauthorized,
                    errorMessage: 'Incorrect data entered',
                    data: null
                };
            }
        }
        return {status: result.status, errorMessage: result.errorMessage, data: null};
    }

    async registration(data: IUserInputModelRegistration) {
        const {login, email, password} = data;
        const result = await this.usersQueryRepositories.doesExistByLoginOrEmail(login, email);

        if (result.message) {
            return {
                status: result.status,
                errorMessage: {
                    message: result.message,
                    field: result.field
                }
            }
        }

        const hash = await bcryptService.generateHash(password)

        const dataUser: IUserDBType = {
            login,
            email,
            hash,
            createdAt: new Date().toISOString(),
            emailConfirmation: {
                confirmationCode: randomUUID(),
                expirationDate: add(new Date(), {hours: 0, minutes: 1}),
                isConfirmed: false
            }
        }

        const user = new UserModel(dataUser);

        await user.save();

        if (user) {
            nodemailerService.sendEmail(email, user.emailConfirmation?.confirmationCode!, emailExamples.registrationEmail)
                .catch(e => {
                    console.log(e)
                })
        }

        return {
            status: ResultCode.NotContent,
        }

    }

    async confirmEmail(code: string) {
        const result = await this.usersQueryRepositories.findUserByCodeConfirmation(code);

        if (result.data?.emailConfirmation?.isConfirmed) {
            return {
                status: ResultCode.Success,
                errorMessage: {
                    message: 'Email already confirmed',
                    field: 'email'
                }
            }
        }

        if (result.data?.emailConfirmation?.expirationDate && result.data.emailConfirmation.expirationDate < new Date()) {
            return {
                status: ResultCode.BadRequest,
                errorMessage: {
                    message: 'The code is not valid',
                    field: 'email'
                }
            }
        }
        if (result.data) {
            try {

                const foundUser = await UserModel.findOne({_id: result.data._id});

                if (foundUser && foundUser.emailConfirmation) {
                    foundUser.emailConfirmation.isConfirmed = true;
                    foundUser.emailConfirmation.expirationDate = null;
                    foundUser.emailConfirmation.confirmationCode = null;
                }

                return {
                    status: ResultCode.NotContent,
                }
            } catch (e) {
                return {
                    status: ResultCode.InternalServerError,
                    errorMessage: {
                        field: 'DB',
                        message: 'Error DB',
                    }
                }
            }
        }

        return {
            status: result.status,
            errorMessage: {
                message: result.message,
                field: result.field
            }
        }
    }

    async resendCode(email: string) {
        const result = await this.checkUserCredential(email);

        if (result.data?.emailConfirmation?.isConfirmed) {
            return {
                status: ResultCode.BadRequest,
                errorMessage: {
                    message: 'Email already confirmed',
                    field: 'email'
                }
            }
        }

        if (result.data && !result.data.emailConfirmation?.isConfirmed) {
            const code = randomUUID();
            const expirationDate = add(new Date().toISOString(), {hours: 0, minutes: 1});

            const user = await UserModel.findOneAndUpdate({_id: result.data._id});

            if (user && user.emailConfirmation) {
                user.emailConfirmation.expirationDate = expirationDate;
                user.emailConfirmation.confirmationCode = code;
            }

            nodemailerService.sendEmail(email, code, emailExamples.registrationEmail).catch(e => console.log(e))

            return {
                status: ResultCode.NotContent,
            }
        }

        return {
            status: result.status,
            errorMessage: {
                message: result.errorMessage || 'Something went wrong',
                field: 'email'
            }
        }
    }

    async logout(token: string) {
        const foundedToken = await RefreshTokenModel.findOne({refreshToken: token})

        if (foundedToken) {
            return {
                status: ResultCode.Unauthorized,
                data: null,
                errorMessage: {
                    message: 'If the JWT refreshToken inside cookie is missing, expired or incorrect',
                    filed: 'token'
                }
            }
        }
        const success = await jwtService.getUserIdByToken(token);

        const invalidRefreshToken = new RefreshTokenModel({refreshToken: token});

        await invalidRefreshToken.save();

        if (success) {

            const data = await decodeToken(token);

            if (data && await this.securityServices.deleteCurrentSession(data)) {
                return {
                    status: ResultCode.NotContent,
                    data: null
                }
            }
        }

        return {
            status: ResultCode.Unauthorized,
            data: null,
            errorMessage: {
                message: 'If the JWT refreshToken inside cookie is missing, expired or incorrect',
                filed: 'token'
            }
        }
    }

    async refreshToken(token: string) {
        const validId = await jwtService.getUserIdByToken(token);

        const findedToken = await RefreshTokenModel.findOne({refreshToken: token});

        if (findedToken) {
            return {
                status: ResultCode.Unauthorized,
                data: null,
                errorMessage: {
                    message: 'If the JWT refreshToken - invalid',
                    field: 'refreshToken'
                }
            }
        }

        if (validId && !findedToken) {

            const newRefreshToken = new RefreshTokenModel({refreshToken: token});

            await newRefreshToken.save();

            const user = await UserModel.findOne({_id: new ObjectId(validId)});

            if (user) {

                const decode = await decodeToken(token);

                if (decode) {
                    const deviceId = decode.deviceId;

                    const accessToken = await jwtService.createdJWT({deviceId, userId: String(user._id)}, '10s')
                    const refreshToken = await jwtService.createdJWT({deviceId, userId: String(user._id)}, '20s')

                    const response = await this.securityServices.updateVersionSession(refreshToken);

                    if (response.status === ResultCode.Success) {
                        return {status: ResultCode.Success, data: {accessToken, refreshToken}};
                    }
                }
            }
        }
        return {
            status: ResultCode.Unauthorized,
            data: null,
            errorMessage: {
                message: 'If the JWT refreshToken inside cookie is missing, expired or incorrect',
                field: 'refreshToken'
            }
        }
    }

    async recoveryCode(email: string) {
        const response = await this.authRepositories.findByEmail(email);

        if (!response.data) {
            return {
                status: ResultCode.NotContent,
                data: null
            }
        }

        const dataCode = await createRecoveryCode(email, '5m');

        const newCode = new RecoveryCodeModel({code: dataCode});

        await newCode.save();

        nodemailerService.sendEmail(email, dataCode, emailExamples.recoveryPasswordByAccount).catch(e => console.log(e))

        return {
            status: ResultCode.NotContent,
            data: null
        }
    }

    async updatePassword(password: string, email: string) {

        const user = await UserModel.findOne({email: email});

        if (user) {
            user.hash = await bcryptService.generateHash(password);
            await user.save()
        }

        return {
            status: ResultCode.NotContent,
            data: null
        }
    }

    async checkValidRecoveryCode(code: string) {
        const response = await jwtService.getEmailByToken(code);

        if (response) return {status: ResultCode.Success, data: response}

        return {
            status: ResultCode.BadRequest, data: null, errorsMessages: [{
                message: 'Incorrect', field: 'recoveryCode'
            }]
        }
    }

    async checkUserCredential(login: string) {
        return await this.authRepositories.findByEmail(login);
    }

    async checkAccessToken(authHeader: string){
        const token = authHeader.split(" ");
        if (token[0] !== 'Bearer') {
            return {
                status: ResultCode.Unauthorized,
                data: null,
                errorMessage: {
                    message: 'Wrong authorization',
                    field: 'header'
                }
            }
        }

        const id = await jwtService.getUserIdByToken(token[1]);
        if (!id) {
            return {
                data: null,
                status: ResultCode.Unauthorized,
                errorMessage: {
                    message: 'Wrong access token',
                    field: 'token'
                }
            }
        }

        const payload = await this.usersRepositories.doesExistById(id);

        if (!payload) {
            return {
                status: ResultCode.Unauthorized,
                data: null,
                errorMessage: {
                    message: 'User not found',
                    field: 'token'
                }
            }
        }

        return {
            status: ResultCode.Success,
            data: payload.id
        }
    }
}