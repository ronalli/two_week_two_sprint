import {MongoMemoryServer} from "mongodb-memory-server";
import {db} from "../../src/db/db";
import {req} from "../test-helpers";
import {HTTP_STATUSES, SETTINGS} from "../../src/settings";
import {serviceUsers} from "../utils/serviceUsers";
import cookie from "cookie";

describe('Security Test', () => {
    beforeEach(async () => {
        const mongoServer = await MongoMemoryServer.create();
        await db.run(mongoServer.getUri());
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

        const user = await serviceUsers.createUser();

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

        // console.log(res.body)

        expect(res.body.length).toEqual(4)

    })

})