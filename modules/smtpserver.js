//Nodemailer
const nodemailer = require('nodemailer');
const transporter  = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'kagabaetienne365@gmail.com',
        pass: 'ogvqinqppsluicum'
    }
});

const Mail = function (response) {
    const email = {
        to: response.To,
        from: '"Etienne Kagaba" kagabaetienne365@gmail.com',
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