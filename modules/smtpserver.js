//  SmtpJS.com - v3.0.0
var Email = { 
    send: function (a) {
        return new Promise(function (n, e) {
            a.nocache = Math.floor(1e6 * Math.random() + 1),
            a.Action = "Send"; var t = JSON.stringify(a);
            
            Email.ajaxPost("https://smtpjs.com/v3/smtpjs.aspx?", t, function (e) {
                n(e)
            })
        }) },
    ajaxPost: function (e, n, t) {
        var a = Email.createCORSRequest("POST", e);
        a.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), a.onload = function () {
            var e = a.responseText;
            null != t && t(e) }, a.send(n) },
    ajax: function (e, n) {
        var t = Email.createCORSRequest("GET", e);
        t.onload = function () {
            var e = t.responseText;
            null != n && n(e) },
        t.send() },
    createCORSRequest: function (e, n) {
        var t = new XMLHttpRequest;
        return "withCredentials" in t ? t.open(e, n, !0) : "undefined" != typeof XDomainRequest ? (t = new XDomainRequest).open(e, n) : t = null, t }
};


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