import {IUserDBType} from "../../src/users/types/user-types";
import {bcryptService} from "../../src/common/adapter/bcrypt.service";
import {randomUUID} from "node:crypto";
import {add} from "date-fns";
import {db} from "../../src/db/db";
import {IBlogInputModel} from "../../src/blogs/types/blogs-types";
import {ICommentInputModel} from "../../src/comments/types/comments-types";

interface IRegisterUserType {
    login: string;
    password: string;
    email: string;
    code?: string;
    expirationDate?: Date;
    isConfirmed?: boolean;
}

export const testSeeder = {
    createUserDto() {
        return {
            login: 'testing',
            password: '12345678',
            email: 'test@gmail.com',
        }
    },

    createUserDtos(count: number) {
        const users = [];

        for (let i = 0; i < count; i++) {
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
    },

    createBlogDto: (): IBlogInputModel => {
        return {
            name: `test blog`,
            description: 'valid test description blog',
            websiteUrl: 'https://it-incubator.com',
        }
    },

    createBlogDtos: (count: number) => {
        const blogs: IBlogInputModel[] = []
        for (let i = 0; i < count; i++) {
            blogs.push({
                name: `testing ${i}`,
                description: `description testing ${i}`,
                websiteUrl: `https://it-incubator${i}.com`,
            })
        }
        return blogs;
    },

    createPostDto: () => {
        return {
            title: 'valid title',
            content: 'content valid post',
            shortDescription: 'post short description valid',
        }
    },

    createPostDtos: (count: number) => {

        const posts = [];

        for (let i = 0; i < count; i++) {
            posts.push({
                title: `valid title ${i}`,
                content: `content valid post ${i}`,
                shortDescription: `post ${i} short description valid`,
            })
        }

        return posts;
    },

    createCommentDto: () => {
        return {
            'content': 'valid content for by comment'
        }
    },
    createCommentDtos: (count: number) => {

        const comments: ICommentInputModel[] = [];

        for (let i = 0; i < count; i++) {
            comments.push({
                'content': `valid content for by comment ${i}`
            })
        }
        return comments;
    },

}