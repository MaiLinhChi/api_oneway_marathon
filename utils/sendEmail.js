const Sendgrid = require('./sendgrid')

const sendEmail = (email) => {
    const msg = {
        to: email, // Change to your recipient
        from: 'admin@onewaymarathon.com', // Change to your verified sender
        subject: 'One Way register verify',
        text: 'Your code to verify One Way account: ',
    }
    return Sendgrid.send(msg).then(rs => ({statusCode: 200, message: 'Please check email', data: rs}))
}

module.exports = {
    sendEmail
}