// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

module.exports = {
    send: (msg) => {
        return sgMail.send(msg).then((rs) => {
            console.log('Email sent', rs)
        }).catch((error) => {
            console.error('sendgrid', error.response.body)
        })
    }
}
