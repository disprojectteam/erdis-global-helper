const nodemailer = require("nodemailer");
const { promisify } = require('util')
const fs = require('fs');
const path = require('path')
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";


const readFileAsync = promisify(fs.readFile)
module.exports = {
    sendEmail: async function (messageTo, messageFrom, subject, message) {
        try {
            const templatePath = path.join(__dirname,'../views/templates/emailtemplate.html')
            var file = await readFileAsync(templatePath);
            file = file.toString();
            let transporter = nodemailer.createTransport({
                host: "mail.colins.com.tr",
                port: 25,
                secure: false,
                ignoreTLS: true, // true for 465, false for other ports
                tls: {
                    ciphers: 'SSLv3'
                }
            });
            file = file.replace('replacethis', message);
            let info = await transporter.sendMail({
                from: messageFrom, // sender address
                to: messageTo, // list of receivers
                subject: subject, // Subject line
                html: file // html body
            });
            return info;
        } catch (error) {
            console.log(error);
        }

    }
}
