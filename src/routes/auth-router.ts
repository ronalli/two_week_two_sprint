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
import {guardRefreshToken} from "../middleware/guardRefreshToken";
import {rateLimitGuard} from "../common/guard/customRateLimit";


export const authRouter = Router({});

authRouter.post('/login', rateLimitGuard, ...validationInputAuth, inputCheckErrorsMiddleware, authController.login)
authRouter.get('/me', authJwtMiddleware, authController.me)


authRouter.post('/registration', rateLimitGuard, ...validationInputRegistrationUser, inputCheckErrorsMiddleware, authController.registration)
authRouter.post('/registration-confirmation', rateLimitGuard, validationCode, inputCheckErrorsMiddleware, authController.confirmationEmail)

authRouter.post('/registration-email-resending', rateLimitGuard, validatorEmail, inputCheckErrorsMiddleware, authController.resendConfirmationCode)

authRouter.post('/refresh-token', guardRefreshToken, authController.refreshToken)

authRouter.post('/logout', guardRefreshToken, authController.logout)