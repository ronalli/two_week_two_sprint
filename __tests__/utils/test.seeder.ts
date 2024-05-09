import {IUserDBType} from "../../src/users/types/user-types";
import {bcryptService} from "../../src/common/adapter/bcrypt.service";
import {randomUUID} from "node:crypto";
import {add} from "date-fns";
import {db} from "../../src/db/db";

interface IRegisterUserType {
    login: string;
    password: string;
    email: string;
    code?: string;
    expirationDate?: Date;
    isConfirmed?: boolean;
}


export const testSeeder = {
    creteUserDto() {
        return {
            login: 'testing',
            password: '12345678',
            email: 'test@gmail.com',
        }
    },

    createUserDtos(count: number) {
        const users = [];

        for(let i = 0; i <= count; i++) {
            users.push({
                login: `testing ${i}`,
                email: `test${i}@gmail.com`,
                password: '12345678',
            })
        }
        return users;
    },

    registerUser: async ({login, password, email, code, isConfirmed, expirationDate}: IRegisterUserType) => {
        const newUser: IUserDBType = {
            login,
            email,
            createdAt: new Date().toISOString(),
            hash: await bcryptService.generateHash(password),
            emailConfirmation: {
                confirmationCode: code || randomUUID(),
                expirationDate: expirationDate || add(new Date(), {hours: 0, minutes: 1}),
                isConfirmed: isConfirmed || false
            }
        }

        const res = await db.getCollections().usersCollection.insertOne({...newUser});
        return {
            id: res.insertedId.toString(),
            ...newUser
        }
    }

}