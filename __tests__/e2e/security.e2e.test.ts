import {MongoMemoryServer} from "mongodb-memory-server";
import {db} from "../../src/db/db";
import {req} from "../test-helpers";
import {HTTP_STATUSES, SETTINGS} from "../../src/settings";
import {serviceUsers} from "../utils/serviceUsers";
import cookie from "cookie";
import {randomUUID} from "node:crypto";
import {jwtService} from "../../src/utils/jwt-services";

describe('Security Test', () => {
    beforeEach(async () => {
        const mongoServer = await MongoMemoryServer.create();
        await db.run(mongoServer.getUri());

        const user = await serviceUsers.createUser();
    })

    afterEach(async () => {
        await req.delete(SETTINGS.PATH.ALL_DELETE + '/all-data')
    })

    afterAll(async () => {
        await req.delete(SETTINGS.PATH.ALL_DELETE + '/all-data')
        await db.stop();
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

})