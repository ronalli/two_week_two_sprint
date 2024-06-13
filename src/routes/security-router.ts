import {Router} from 'express';
import {guardRefreshToken} from "../middleware/guardRefreshToken";
import {container} from "../composition-root";
import {SecurityController} from "../security/securityController";

const securityController = container.resolve(SecurityController);

export const securityRouter = Router({});

securityRouter.get('/', guardRefreshToken, securityController.getSessions.bind(securityController))
securityRouter.delete('/', guardRefreshToken, securityController.deleteAllDevices.bind(securityController))
securityRouter.delete('/:deviceId', guardRefreshToken, securityController.deleteDeviceById.bind(securityController))