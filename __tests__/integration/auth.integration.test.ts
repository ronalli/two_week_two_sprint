import {MongoMemoryServer} from "mongodb-memory-server";
import {db} from "../../src/db/db";
import {authService} from "../../src/auth/authService";
import {nodemailerService} from "../../src/common/adapter/nodemailer.service";
import {testSeeder} from "../utils/test.seeder";
import {ResultCode} from "../../src/types/resultCode";

describe('auth-integration', () => {

    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create();
        await db.run(mongoServer.getUri());
    })

    beforeEach(async () => {
        await db.drop();
    })

    afterEach(async () => {

    })

    afterAll(async () => {
        await db.drop();
        await db.stop();
    })

    afterAll(done => done())

    describe('User registration', () => {

        const registerUser = authService.registration;

        nodemailerService.sendEmail = jest.fn().mockImplementation((email: string, code: string, template: (code: string) => string) => {
            return true;
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