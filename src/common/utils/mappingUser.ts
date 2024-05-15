import {IUserDBType, IUserViewModel} from "../../users/types/user-types";

export const mappingUser = {
    inputViewModelUser: (user: IUserDBType): IUserViewModel => {
        return {
            id: String(user._id),
            email: user.email,
            login: user.login,
            createdAt: user.createdAt,
        }
    }
}