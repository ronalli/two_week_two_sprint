import {MongoMemoryServer} from "mongodb-memory-server";
import {db} from "../../src/db/db";
import {req} from "../test-helpers";
import {HTTP_STATUSES, SETTINGS} from "../../src/settings";
import {serviceUsers} from "../utils/serviceUsers";
import cookie from "cookie";
import {randomUUID} from "node:crypto";
import {jwtService} from "../../src/utils/jwt-services";
import {decodeToken} from "../../src/common/utils/decodeToken";


const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


describe('Security Test', () => {
    beforeAll(async () => {
        // const mongoServer = await MongoMemoryServer.create();
        await db.run();

    })

    beforeEach(async () => {
        await serviceUsers.createUser();
    })

    afterEach(async () => {
        await db.dropCollections();
    })

    afterAll(async () => {
        await db.dropDB()
    })

    afterAll(done => done())

    it('Correct response all devices user', async () => {

        const login = {
            loginOrEmail: 'testing',
            password: '12345678',
        }

        await req.post(SETTINGS.PATH.AUTH + '/login').send(login).set('user-agent', 'chrome-13').expect(HTTP_STATUSES.Success)
        await req.post(SETTINGS.PATH.AUTH + '/login').send(login).set('user-agent', 'android').expect(HTTP_STATUSES.Success)
        await req.post(SETTINGS.PATH.AUTH + '/login').send(login).set('user-agent', 'windows').expect(HTTP_STATUSES.Success)
        const response = await req.post(SETTINGS.PATH.AUTH + '/login').send(login).set('user-agent', 'linux').expect(HTTP_STATUSES.Success)

        const cookies = cookie.parse(String(response.headers['set-cookie']));

        expect(cookies).toBeDefined();

        await req.get(SETTINGS.PATH.SECURITY).expect(HTTP_STATUSES.Unauthorized)

        const res = await req.get(SETTINGS.PATH.SECURITY).set('Cookie', `refreshToken=${cookies.refreshToken}`).expect(HTTP_STATUSES.Success);


        expect(res.body.length).toEqual(4)

    })

    it('should response status 404, because device not found', async () => {

        const login = {
            loginOrEmail: 'testing',
            password: '12345678',
        }

        const response = await req.post(SETTINGS.PATH.AUTH + '/login').send(login).set('user-agent', 'chrome-13').expect(HTTP_STATUSES.Success)

        const cookies = cookie.parse(String(response.headers['set-cookie']));

        expect(cookies).toBeDefined();

        const uuid = randomUUID();

        await req.delete(SETTINGS.PATH.SECURITY + `/${uuid}`).set('Cookie', `refreshToken=${cookies.refreshToken}`).expect(HTTP_STATUSES.NotFound)

    })

    it('should response status 401, because not valid refresh token', async () => {

        const token = await jwtService.createdJWT({userId: randomUUID(), deviceId: randomUUID()}, '20s')

        await req.get(SETTINGS.PATH.SECURITY).set('Cookie', `refreshToken=${token}`)
            .expect(HTTP_STATUSES.Unauthorized)

    })

    it('should response status 403, because delete not your session', async () => {

        await req.post(SETTINGS.PATH.AUTH + '/registration').send({
            email: 'bob@bob.com', login: 'bob', password: '12345678'
        }).expect(HTTP_STATUSES.NotContent)

        const response1 = await req.post(SETTINGS.PATH.AUTH + '/login').send({
            loginOrEmail: 'bob@bob.com',
            password: '12345678'
        }).expect(HTTP_STATUSES.Success)

        const cookies = cookie.parse(String(response1.headers['set-cookie']));

        const response2 = await req.post(SETTINGS.PATH.AUTH + '/login').send({
            loginOrEmail: 'testing',
            password: '12345678',
        }).expect(HTTP_STATUSES.Success)

        const cookies1 = cookie.parse(String(response2.headers['set-cookie']));

        const device = await req.get(SETTINGS.PATH.SECURITY).set('Cookie', `refreshToken=${cookies1.refreshToken}`).expect(HTTP_STATUSES.Success)

        await req.delete(SETTINGS.PATH.SECURITY + `/${device.body[0].deviceId}`).set('Cookie', `refreshToken=${cookies.refreshToken}`).expect(HTTP_STATUSES.Forbidden)

    })

    it('Correct update last active date current device', async () => {

        const login = {
            loginOrEmail: 'testing',
            password: '12345678',
        }

        const response = await req.post(SETTINGS.PATH.AUTH + '/login').send(login).set('user-agent', 'chrome-13').expect(HTTP_STATUSES.Success)

        await req.post(SETTINGS.PATH.AUTH + '/login').send(login).set('user-agent', 'android').expect(HTTP_STATUSES.Success)
        await req.post(SETTINGS.PATH.AUTH + '/login').send(login).set('user-agent', 'windows').expect(HTTP_STATUSES.Success)

        await req.post(SETTINGS.PATH.AUTH + '/login').send(login).set('user-agent', 'linux').expect(HTTP_STATUSES.Success)

        const cookies = cookie.parse(String(response.headers['set-cookie']));

        await wait(1500)

        const updateRefreshToken = await req.post(SETTINGS.PATH.AUTH + '/refresh-token').set('Cookie', `refreshToken=${cookies.refreshToken}`).expect(HTTP_STATUSES.Success)

        const cookies1 = cookie.parse(String(updateRefreshToken.headers['set-cookie']));

        const allDevices = await req.get(SETTINGS.PATH.SECURITY).set('Cookie', `refreshToken=${cookies1.refreshToken}`).expect(HTTP_STATUSES.Success)

        const decode = await decodeToken(cookies.refreshToken)

        expect(decode!.iat).not.toBe(allDevices.body[0].lastActiveDate)

    })

    it('correct delete selected device, and response length devices on one less', async () => {

        const login = {
            loginOrEmail: 'testing',
            password: '12345678',
        }

        const device1 = await req.post(SETTINGS.PATH.AUTH + '/login').send(login).set('user-agent', 'Windows 7').expect(HTTP_STATUSES.Success)
        const device2 = await req.post(SETTINGS.PATH.AUTH + '/login').send(login).set('user-agent', 'IOS 17').expect(HTTP_STATUSES.Success)
        await req.post(SETTINGS.PATH.AUTH + '/login').send(login).set('user-agent', 'Symbian OS').expect(HTTP_STATUSES.Success)
        await req.post(SETTINGS.PATH.AUTH + '/login').send(login).set('user-agent', 'XP 3').expect(HTTP_STATUSES.Success)

        const cookies1 = cookie.parse(String(device1.headers['set-cookie']));

        const cookies2 = cookie.parse(String(device2.headers['set-cookie']));

        const allDevices = await req.get(SETTINGS.PATH.SECURITY).set('Cookie', `refreshToken=${cookies1.refreshToken}`).expect(HTTP_STATUSES.Success)

        const decode = await decodeToken(cookies2.refreshToken);

        const array = allDevices.body.filter((device: { deviceId: string; }) => device.deviceId === decode!.deviceId)

        await req.delete(SETTINGS.PATH.SECURITY + `/${decode!.deviceId}`).set('Cookie', `refreshToken=${cookies1.refreshToken}`).expect(HTTP_STATUSES.NotContent)

        const allDevices2 = await req.get(SETTINGS.PATH.SECURITY).set('Cookie', `refreshToken=${cookies1.refreshToken}`).expect(HTTP_STATUSES.Success)

        expect(allDevices2.body).toHaveLength(3)

        expect(allDevices2.body).not.toContainEqual(array[0])

    })


})