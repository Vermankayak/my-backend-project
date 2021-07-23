import nodemailer from 'nodemailer'
import sendgrid from 'nodemailer-sendgrid-transport'

export class Nodemailer{
    static initializeTransport() {
        return nodemailer.createTransport(sendgrid({
            auth:{
                api_key: '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'
            }
        }))
    }

    static sendEmail(data) {
        return Nodemailer.initializeTransport().sendMail({
            from:'niharku@gmail.com',
            to: data.to,
            subject:data.subject,
            html:data.html,
        })
    }
}