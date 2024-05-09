import {req} from "../test-helpers";
import {HTTP_STATUSES, SETTINGS} from "../../src/settings";
import {testSeeder} from "./test.seeder";

export const createUser = async () => {
    const response = await req.post(SETTINGS.PATH.USERS)
        .auth('Authorization', process.env.AUTH_HEADER || '')
        .send(testSeeder.creteUserDto()).expect(HTTP_STATUSES.Success)
    return response.body;
}

export const createUsers = async (count: number) => {
    const users = [];

    for(let i = 0; i <= count; i++) {
        const response = await req.post(SETTINGS.PATH.USERS).auth('Authorization', process.env.AUTH_HEADER || '').send({
            login: `testing ${i}`,
            email: `test${i}@gmail.com`,
            password: '12345678',
        }).expect(HTTP_STATUSES.Success);
        users.push(response.body)
    }
    return users;
}

