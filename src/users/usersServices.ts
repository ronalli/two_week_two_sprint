import {IUserInputModel} from "./types/user-types";
import {UsersRepositories} from "./usersRepositories";
import {inject, injectable} from "inversify";

@injectable()
export class UsersServices {
    constructor(@inject(UsersRepositories) protected usersRepositories: UsersRepositories) {
    }

    async createUser(data: IUserInputModel) {
        return await this.usersRepositories.createUser(data);
    }

    async deleteUser(id: string) {
        return await this.usersRepositories.deleteUser(id);
    }

    async findUser(id: string) {
        return await this.usersRepositories.findUserById(id)
    }
}
