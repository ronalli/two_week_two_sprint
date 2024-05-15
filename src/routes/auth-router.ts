import {Router} from "express";
import {authController} from "../auth/authController";
import {validationInputAuth} from "../auth/middleware/input-validation-middleware";
import {inputCheckErrorsMiddleware} from "../middleware/inputCheckErrorsMiddleware";
import {authJwtMiddleware} from "../middleware/auth-jwt-middleware";
import {
    validationInputRegistrationUser,
    validatorEmail
} from "../auth/middleware/input-registarion-validation-middleware";
import {validationCode} from "../auth/middleware/input-registration-confirmation-middleware";


export const authRouter = Router({});

authRouter.post('/login', ...validationInputAuth, inputCheckErrorsMiddleware, authController.login);
authRouter.get('/me', authJwtMiddleware, authController.me)


authRouter.post('/registration', ...validationInputRegistrationUser, inputCheckErrorsMiddleware, authController.registration)
authRouter.post('/registration-confirmation', validationCode, inputCheckErrorsMiddleware, authController.confirmationEmail)


authRouter.post('/registration-email-resending', validatorEmail, inputCheckErrorsMiddleware, authController.resendConfirmationCode)

authRouter.post('/refresh-token')

authRouter.get('/logout', authController.logout)