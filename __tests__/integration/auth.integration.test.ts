import 'reflect-metadata';

import {db} from "../../src/db/db";
import {nodemailerService} from "../../src/common/adapter/nodemailer.service";
import {testSeeder} from "../utils/test.seeder";
import {ResultCode} from "../../src/types/resultCode";
import {container} from "../../src/composition-root";
import {AuthService} from "../../src/auth/authService";

const authService = container.resolve(AuthService);

describe('auth-integration', () => {

    beforeAll(async () => {
        await db.run();
    })

    beforeEach(async () => {
        await db.dropCollections();
    })

    afterAll(async () => {
        await db.dropDB();
    })

    afterAll(done => done())

    describe('User registration', () => {

        const registerUser = authService.registration.bind(authService);

        nodemailerService.sendEmail = jest.fn().mockImplementation((email: string, code: string, template: (code: string) => string) => {
            return Promise.resolve(true);
        })

        it('should register user with correct data', async () => {

            const userDto = testSeeder.createUserDto();
            const result = await registerUser(userDto);

            expect(result.status).toBe(ResultCode.NotContent);

            expect(nodemailerService.sendEmail).toHaveBeenCalled();
            expect(nodemailerService.sendEmail).toHaveBeenCalledTimes(1);

        })

        it('should not register user twice', async () => {
            const user = testSeeder.createUserDto();
            await testSeeder.registerUser(user)

            const result = await registerUser(user);
            expect(result.status).toBe(ResultCode.BadRequest);
        })

    })

})