import {Router} from 'express';
import {guardRefreshToken} from "../middleware/guardRefreshToken";
import {securityController} from "../composition-root";

export const securityRouter = Router({});

securityRouter.get('/', guardRefreshToken, securityController.getSessions.bind(securityController))
securityRouter.delete('/', guardRefreshToken, securityController.deleteAllDevices.bind(securityController))
securityRouter.delete('/:deviceId', guardRefreshToken, securityController.deleteDeviceById.bind(securityController))