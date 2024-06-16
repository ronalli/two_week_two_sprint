import 'reflect-metadata';

import {req} from "../test-helpers";
import {HTTP_STATUSES} from "../../src/settings";
import {SETTINGS} from "../../src/settings";
import {db} from "../../src/db/db";
import {testSeeder} from "../utils/test.seeder";
import cookie from "cookie";
import {serviceUsers} from "../utils/serviceUsers";
import {RecoveryCodeModel} from "../../src/auth/domain/recoveryCode.entity";
import {jwtService} from "../../src/utils/jwt-services";


describe("Auth Tests", () => {
    beforeAll(async () => {
        await db.run();
    })

    afterEach(async () => {
        await db.dropCollections();
    })

    afterAll(async () => {
        await db.dropDB()
    })

    afterAll(done => done())

    it("shouldn't correct auth - not found user", async () => {

        const auth = {
            loginOrEmail: 'testing',
            password: 'password',
        }
        await req.post(SETTINGS.PATH.AUTH + '/login').send(auth).expect(HTTP_STATUSES.Unauthorized)
    })

    it("should correct authorization", async () => {

        await serviceUsers.createUser()

        const auth = {
            loginOrEmail: 'testing',
            password: '12345678',
        }
        const res = await req.post(SETTINGS.PATH.AUTH + '/login').send(auth).expect(HTTP_STATUSES.Success)

        expect(res.body.accessToken).toEqual(expect.any(String))
    })

    it("should correct getting info for user login", async () => {

       await serviceUsers.createUser()

        const auth = {
            loginOrEmail: 'testing',
            password: '12345678',
        }

        const jwtToken = await req.post(SETTINGS.PATH.AUTH + '/login').send(auth);

        const response = await req.get(SETTINGS.PATH.AUTH + '/me').set('Authorization', `Bearer ${jwtToken.body.accessToken}`).expect(HTTP_STATUSES.Success)

        expect(auth.loginOrEmail).toBe(response.body.login)
    })

    it("shouldn't correct auth", async () => {

        await req.get(SETTINGS.PATH.AUTH + '/me').set('Authorization', `Bearer e5rt78ert9er.54354.24fs4df432s`).expect(HTTP_STATUSES.Unauthorized)
    })

    it('should correct registration', async () => {
        let newUser = {
            login: 'Bob',
            password: '12345678',
            email: 'bob1@gmail.com',
        }

        await req.post(SETTINGS.PATH.AUTH + '/registration').send(newUser).expect(HTTP_STATUSES.NotContent)
    })

    it('shouldn\'t correct registration (email/login founded by DB)', async () => {
        await serviceUsers.createUser()

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

        await req.post(SETTINGS.PATH.AUTH + '/registration-email-resending').send({email: 'test@gmail.com'}).expect(HTTP_STATUSES.BadRequest)
    })

    it('shouldn\'t registration user with the same login or email  ', async () => {

        await serviceUsers.createUser()

        await req.post(SETTINGS.PATH.AUTH + '/registration').send(testSeeder.createUserDto()).expect(HTTP_STATUSES.BadRequest)
    })

    it('shouldn\'t get refreshToken and accessToken because of refreshToken be out in cookie', async () => {
        await req.post(SETTINGS.PATH.AUTH + '/refresh-token').expect(HTTP_STATUSES.Unauthorized)
    })

    it('should correct get refresh token', async () => {

        await serviceUsers.createUser()

        const auth = {
            loginOrEmail: 'testing',
            password: '12345678',
        }

        const response = await req.post(SETTINGS.PATH.AUTH + '/login').send(auth).expect(HTTP_STATUSES.Success)

        const cookies = cookie.parse(String(response.headers['set-cookie']));

        expect(cookies).toBeDefined();

        const res = await req.post(SETTINGS.PATH.AUTH + '/refresh-token').set('Cookie', `refreshToken=${cookies.refreshToken}`).expect(HTTP_STATUSES.Success);

        expect(res.body.accessToken).toEqual(expect.any(String))


    })

    it('shouldn\'t return tokens with invalid refresh token', async () => {
        await req.post(SETTINGS.PATH.AUTH + '/logout').set('Cookie', `refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjQ2MjI5Njc2MzE3NzFjNWY1OWUzN2EiLCJpYXQiOjE3MTU4NzI0MDcsImV4cCI6MTcxNTg3MjQyN30.M2vM7RX1o28QH2e8jICFVsOD67Dk_5Y07XZBI73EPqc`).expect(HTTP_STATUSES.Unauthorized)

    })

    it('shouldn\'t return tokens with refresh token is not found in cookies', async () => {
        await req.post(SETTINGS.PATH.AUTH + '/logout').expect(HTTP_STATUSES.Unauthorized)
    })


    it('should response code 401 ', async () => {
        await req.post(SETTINGS.PATH.AUTH + '/refresh-token').set('Cookie', 'refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjQ2MjUxOTE2MmZhZTVhY2IyOGU2ZmYiLCJpYXQiOjE3MTU4NzMwNzgsImV4cCI6MTcxNTg3MzA5OH0.4h63x8D3cR-qLeUx2jkCOPGIkhEIvQcrcYxG2fj3D5o').expect(HTTP_STATUSES.Unauthorized)

    });

    it('should correct logout', async () => {

        await serviceUsers.createUser()

        const auth = {
            loginOrEmail: 'testing',
            password: '12345678',
        }

        const response = await req.post(SETTINGS.PATH.AUTH + '/login').send(auth).expect(HTTP_STATUSES.Success)

        const cookies = cookie.parse(String(response.headers['set-cookie']));

        expect(cookies).toBeDefined();

        const res = await req.post(SETTINGS.PATH.AUTH + '/refresh-token').set('Cookie', `refreshToken=${cookies.refreshToken}`).expect(HTTP_STATUSES.Success);

        const cook = cookie.parse(String(res.headers['set-cookie']));

        await req.post(SETTINGS.PATH.AUTH + '/logout').expect(HTTP_STATUSES.Unauthorized);

        await req.post(SETTINGS.PATH.AUTH + '/logout').set('Cookie', `refreshToken=${cook.refreshToken}`).expect(HTTP_STATUSES.NotContent);
    })


    it('should correct recovery and update password', async () => {

        const user = await serviceUsers.createUser()

        const code = await jwtService.createdRecoveryCode(user.email, '1h')

        const recoveryCode = new RecoveryCodeModel({code: code})

        await recoveryCode.save();

        await req.post(SETTINGS.PATH.AUTH + '/login').send({
            'loginOrEmail': user.login,
            'password': '12345678'
        }).expect(HTTP_STATUSES.Success)

        const recoveryData = {
            'newPassword': '87654321',
            'recoveryCode': code
        }

        await req.post(SETTINGS.PATH.AUTH + '/new-password').send(recoveryData).expect(HTTP_STATUSES.NotContent)

        await req.post(SETTINGS.PATH.AUTH + '/login').send({
            'loginOrEmail': user.login,
            'password': '12345678'
        }).expect(HTTP_STATUSES.Unauthorized)

        await req.post(SETTINGS.PATH.AUTH + '/login').send({
            'loginOrEmail': user.login,
            'password': '87654321'
        }).expect(HTTP_STATUSES.Success)

    })


})