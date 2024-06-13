import {Router} from "express";
import {validationInputAuth} from "../auth/middleware/input-validation-middleware";
import {inputCheckErrorsMiddleware} from "../middleware/inputCheckErrorsMiddleware";
import {
    validationInputRegistrationUser,
    validatorEmail, validatorNewPassword
} from "../auth/middleware/input-registarion-validation-middleware";
import {validationCode} from "../auth/middleware/input-registration-confirmation-middleware";
import {guardRefreshToken} from "../middleware/guardRefreshToken";
import {rateLimitGuard} from "../common/guard/customRateLimit";
import {authJwtMiddleware} from "../middleware/auth-jwt-middleware";
import {container} from "../composition-root";
import {AuthController} from "../auth/authController";

const authController = container.resolve(AuthController)

export const authRouter = Router({});

authRouter.get('/me', authJwtMiddleware, authController.me.bind(authController));

authRouter.post('/login', rateLimitGuard, ...validationInputAuth, inputCheckErrorsMiddleware, authController.login.bind(authController))

authRouter.post('/registration', rateLimitGuard, ...validationInputRegistrationUser, inputCheckErrorsMiddleware, authController.registration.bind(authController))
authRouter.post('/registration-confirmation', rateLimitGuard, validationCode, inputCheckErrorsMiddleware, authController.confirmationEmail.bind(authController))

authRouter.post('/registration-email-resending', rateLimitGuard, validatorEmail, inputCheckErrorsMiddleware, authController.resendConfirmationCode.bind(authController))

authRouter.post('/refresh-token', guardRefreshToken, authController.refreshToken.bind(authController))

authRouter.post('/logout', guardRefreshToken, authController.logout.bind(authController))

authRouter.post('/password-recovery', rateLimitGuard, validatorEmail, inputCheckErrorsMiddleware, authController.passwordRecovery.bind(authController))

authRouter.post('/new-password', rateLimitGuard, validatorNewPassword, inputCheckErrorsMiddleware, authController.setNewPassword.bind(authController))