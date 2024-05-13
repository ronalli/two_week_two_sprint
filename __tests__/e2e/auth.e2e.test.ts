import {req} from "../test-helpers";
import {HTTP_STATUSES} from "../../src/settings";
import {SETTINGS} from "../../src/settings";
import {db} from "../../src/db/db";

import {MongoMemoryServer} from "mongodb-memory-server";
import {testSeeder} from "../utils/test.seeder";
import {serviceUsers} from "../utils/serviceUsers";

describe("Auth Tests", () => {
    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create();
        await db.run(mongoServer.getUri());

        await req.post(SETTINGS.PATH.USERS).set('Authorization', process.env.AUTH_HEADER || '')
            .send(testSeeder.createUserDto())

    })

    afterEach(async () => {
        await db.drop();
    })

    afterAll(async () => {
        // await req.delete(SETTINGS.PATH.ALL_DELETE + '/all-data')
        await db.drop();
    })

    afterAll(async () => {
        await db.stop();
    })

    afterAll(done => done())

    it("shouldn't correct auth - not found user", async () => {
        const auth = {
            loginOrEmail: 'testing',
            password: 'password',
        }
        await req.post(SETTINGS.PATH.AUTH + '/login').send(auth).expect(HTTP_STATUSES.Unauthorized)
    })

    it("should correct authorization", async() => {
        const auth = {
            loginOrEmail: 'testing',
            password: '12345678',
        }
        await req.post(SETTINGS.PATH.AUTH + '/login').send(auth).expect(HTTP_STATUSES.Success)
    })

    it("should correct getting info for user login", async() => {
        const auth = {
            loginOrEmail: 'testing',
            password: '12345678',
        }
        const jwtToken = await req.post(SETTINGS.PATH.AUTH + '/login').send(auth);

        const infoUser = await req.get(SETTINGS.PATH.AUTH + '/me').set('Authorization', `Bearer ${jwtToken.body.accessToken}`).expect(HTTP_STATUSES.Success)
    })

    it("shouldn't correct auth", async() => {

        const infoUser = await req.get(SETTINGS.PATH.AUTH + '/me').set('Authorization', `Bearer e5rt78ert9er.54354.24fs4df432s`).expect(HTTP_STATUSES.Unauthorized)
    })

    it('should correct registration', async () => {
        let newUser = {
            login: 'Bob1',
            password: '12345678',
            email: 'bob1@gmail.com',
        }

        await req.post(SETTINGS.PATH.AUTH + '/registration').send(newUser).expect(HTTP_STATUSES.NotContent)

    })

    it('shouldn\'t correct registration (email/login founded by DB)', async () => {
        let newUser = testSeeder.createUserDto()

        await req.post(SETTINGS.PATH.AUTH + '/registration').send(newUser).expect(HTTP_STATUSES.BadRequest)

    })

    it('shouldn\'t correct login', async () => {

        await req.post(SETTINGS.PATH.AUTH + '/login').send({
            loginOrEmail: '',
            password: '',
        }).expect(HTTP_STATUSES.BadRequest)

        await req.post(SETTINGS.PATH.AUTH + '/login').send({
            loginOrEmail: 'rest',
            password: 'res',
        }).expect(HTTP_STATUSES.Unauthorized)

    })

    it('should incorrect resend code, since the user was created by admin and isConfirmed = true', async () => {

       const user = await serviceUsers.createUser();

       await req.post(SETTINGS.PATH.AUTH + '/registration-email-resending').send({email: user.email}).expect(HTTP_STATUSES.BadRequest)

    })

})