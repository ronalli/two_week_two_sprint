// // import {db} from "../../src/db/db";
// // import {jwtService} from "../../src/utils/jwt-services";
// // import {UsersRepositories} from "../../src/users/usersRepositories";
// // import {AuthService} from "../../src/auth/authService";
// // import {ResultCode} from "../../src/types/resultCode";
// // import {ObjectId} from "mongodb";
// //
// // const usersRepositories = new UsersRepositories()
// // const authService = new AuthService();
// //
// // describe('auth-integration', () => {
// //
// //     beforeAll(async () => {
// //         await db.run();
// //     })
// //
// //     beforeEach(async () => {
// //         await db.dropCollections()
// //     })
// //
// //     afterAll(async () => {
// //         await db.dropDB();
// //     })
// //
// //     afterAll(done => done())
// //
// //     const checkAccessTokenUseCase = authService.checkAccessToken.bind(authService);
// //
// //
// //     it('should not verify noBearer auth', async () => {
// //         const result = await checkAccessTokenUseCase('Basic grt43fs466')
// //         expect(result.status).toBe(ResultCode.Unauthorized)
// //     })
// //
// //     it('should not verify in jwtService', async () => {
// //         jwtService.getUserIdByToken = jest.fn().mockImplementation((token: string) => null)
// //
// //         const result = await checkAccessTokenUseCase('Bearer grt43fs466')
// //
// //         expect(result.status).toBe(ResultCode.Unauthorized)
// //     })
// //
// //     it('should not verify in usersMongoRepositories', async() => {
// //         jwtService.getUserIdByToken = jest.fn().mockImplementation((token: string) => {
// //             return new ObjectId().toHexString()
// //         })
// //
// //         usersRepositories.doesExistById = jest.fn().mockImplementation((userId: string) => {
// //             return null;
// //         })
// //
// //         const result = await checkAccessTokenUseCase('Bearer grt43fs466')
// //
// //         expect(result.status).toBe(ResultCode.Unauthorized)
// //     })
// //
// //     it('should correct verify user', async() => {
// //         jwtService.getUserIdByToken = jest.fn().mockImplementation((token: string) => {
// //             return new ObjectId().toHexString()
// //         })
// //         usersRepositories.doesExistById = jest.fn().mockImplementation((userId: string) => {
// //             return {
// //                 data: 'fd6sfs8d'
// //             }
// //         })
// //
// //         const result = await checkAccessTokenUseCase('Bearer grt43fs466')
// //
// //         expect(result.status).toBe(ResultCode.Success)
// //     })
// //
// // })
//
//
// import {jwtService} from "../../src/utils/jwt-services";
// import {ResultCode} from "../../src/types/resultCode";
// import {AuthService} from "../../src/auth/authService";
//
// jest.mock('../../src/utils/jwt-services');
// jest.mock('../../src/users/usersRepositories')
//
// describe('Auth Service', () => {
//     let authService: AuthService;
//     const mockUsersRepositories = {
//         doesExistById: jest.fn()
//     }
//
//     beforeAll(() => {
//         authService = new AuthService(mockUsersRepositories);
//     })
//
//     describe('checkAccessToken', () => {
//
//         it('should return status Unauthorized if header authorization is wrong', async () => {
//
//             const authHeader = 'invalidHeader';
//
//             const response = await authService.checkAccessToken(authHeader);
//
//             expect(response.status).toBe(ResultCode.Unauthorized);
//             expect(response.errorMessage!.message).toBe('Wrong authorization');
//             expect(response.errorMessage!.field).toBe('header');
//         })
//
//         it('should return Unauthorized if token is invalid', async () => {
//             (jwtService.getUserIdByToken as jest.Mock).mockReturnValue(null)
//
//             const authHeader = 'Bearer invalid_header';
//
//             const response = await authService.checkAccessToken(authHeader);
//
//             expect(response.status).toBe(ResultCode.Unauthorized);
//             expect(response.errorMessage!.message).toBe('Wrong access token')
//             expect(response.errorMessage!.field).toBe('token')
//
//         })
//
//         it('should return Unauthorized if user not found', async () => {
//
//             const validToken = 'validToken';
//             const userId = 'valid_user_id';
//
//             authService.
//
//             (jwtService.getUserIdByToken as jest.Mock).mockReturnValue(userId);
//             (mockUsersRepositories.doesExistById as jest.Mock).mockReturnValue(null)
//
//             const authHeader = `Bearer ${validToken}`;
//
//             const response = await authService.checkAccessToken(authHeader);
//
//             expect(response.status).toBe(ResultCode.Unauthorized);
//             expect(response.errorMessage!.message).toBe('User not found');
//             expect(response.errorMessage!.field).toBe('token');
//
//         })
//
//         it('should return Success if user is found', async () => {
//
//             const validToken = 'validToken';
//             const userId = 'valid_user_id';
//             const payload = {id: userId};
//
//             (jwtService.getUserIdByToken as jest.Mock).mockReturnValue(userId);
//             (mockUsersRepositories.doesExistById as jest.Mock).mockReturnValue(payload);
//
//             const authHeader = `Bearer ${validToken}`;
//
//             const response = await authService.checkAccessToken(authHeader);
//
//             expect(response.status).toBe(ResultCode.Success);
//             expect(response.data).toBe(userId)
//
//         })
//
//     })
//
// })