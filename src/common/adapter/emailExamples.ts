export const emailExamples = {
    registrationEmail: (code: string) => {
        return `
                <h1>Thanks for your registration</h1>
                <p>To finish registration please follow the link below:
                <a href='http://localhost:3000/hometask_07/api/auth/registration-confirmation?code=${code}'>complete registration</a>
            </p>
        `
    }
}