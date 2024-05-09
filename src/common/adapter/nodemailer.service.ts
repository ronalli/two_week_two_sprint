import nodemailer from 'nodemailer';

export const nodemailerService = {
    sendEmail: async (email: string, code: string, template: (code: string) => string) => {
        // let transporter = nodemailer.createTransport({
        //
        //     host: process.env.HOST,
        //     port: Number(process.env.PORT_HOST),
        //     secure: true,
        //     auth: {
        //         user: process.env.EMAIL,
        //         pass: process.env.PASSWORD_EMAIL,
        //     }
        // })
        let transporter = nodemailer.createTransport({
           service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD_EMAIL,
            }
        })

        let info = await transporter.sendMail({
            from: `${process.env.EMAIL}`,
            to: email,
            subject: 'Hello World',
            html: template(code),
        })

        return !!info
    }

}