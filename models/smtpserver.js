//Nodemailer
const nodemailer = require('nodemailer');
const transporter  = nodemailer.createTransport({
    service: 'gmail',
    port: 465,
    secure: true,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});

const Mail = function (response) {
    const email = {
        to: response.To,
        from: `"Etienne Kagaba" ${process.env.GMAIL_USER}`,
        subject: response.Subject,
        text: response.Body
    }
    transporter.sendMail(email)
        .then( result => {
            console.log('Email Sent');
        })
        .catch(err => {
            console.log(err);
        })
}

module.exports = Mail;