const nmailer = require('nodemailer');

module.exports.sendMail = async function (email, passwordToken, callback) {
    let account = await nmailer.createTestAccount(); 
    let transporter = nmailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587, secure: false, // true for 465, false for other ports
        auth: {
            user: account.user, // generated ethereal user
            pass: account.pass // generated ethereal password 
        }
    });

    let mailOptions = {
        from: '"Pied Piper" <no-reply@piedpiper.com>',
        to: "snjv.work@gmail.com",
        subject: "Reset Password Link",
        text: "Hey, Friend!",
        html: `<h3>Your password reset token is valid for two hours only! Don't share it with anyone.<h3> 
              <br/><a href="http://localhost:4200/reset_password?token=${passwordToken}" target="_blank">Change Password<a>`

    };
    let info = await transporter.sendMail(mailOptions);
    if (info) {
        console.log("Preview URL: %s", nmailer.getTestMessageUrl(info));
        callback(null, true);
    }
    else {
        callback(new Error('Error occured while sending an email! Please report this.'),
            false);
    }
}

