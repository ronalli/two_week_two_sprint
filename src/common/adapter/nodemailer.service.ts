import nodemailer from 'nodemailer';

export const nodemailerService = {
    sendEmail: async (email: string, code: string, template: (code: string) => string) => {
        try {
            let transporter = nodemailer.createTransport({
                host: process.env.HOST,
                port: Number(process.env.PORT_HOST),
                secure: true,
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD_EMAIL,
                }
            })

            let info = await transporter.sendMail({
                from: `${process.env.EMAIL}`,
                to: email,
                subject: 'Registration by site',
                html: template(code),
            })

            return !!info
        } catch (e) {
            throw e;
        }
    }

}
