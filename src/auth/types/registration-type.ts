import {IUserDBType} from "../../users/types/user-types";

export interface IUserInputModelRegistration {
    login: string;
    password: string;
    email: string;
}

// export interface IUserDB extends IUserDBType {
//     emailConfirmation: {
//         confirmationCode: string,
//         expirationDate: Date,
//         isConfirmed: boolean
//     }
// }