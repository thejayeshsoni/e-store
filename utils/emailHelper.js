const nodemailer = require("nodemailer");

const mailHelper = async (options) => {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_AUTH_USER, // generated ethereal user
            pass: process.env.SMTP_AUTH_PASS, // generated ethereal password
        },
    });

    const message = {
        from: '"Jayesh Soni 👻" <sonijayesh12345@gmail.com>', // sender address
        to: options.toEmail, // list of receivers
        subject: options.subject, // Subject line
        text: options.message, // plain text body
    };

    // send mail with defined transport object
    await transporter.sendMail(message);
};

module.exports = mailHelper;