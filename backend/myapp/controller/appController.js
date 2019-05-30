var mongoo = require('mongoose');
var suserschm = require('../models/registered');

const Users = require('../models/registered');
const Chats = require('../models/chatZone');
const jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
var passToken = require('./forgottoken');
var multer = require('multer');
var path = require('path');

//const url='mongodb://localhost:27017/files';
const url = 'mongodb://sdirectdb:sdirectdb@192.168.0.5:27017/sdirectdb';
mongoo.connect(url);



module.exports.createUser = function (req, res) {
    console.log(req.body);
    var syncuser = new suserschm(req.body);
    syncuser.save((err, data) => {
        if (err) {
            res.send(err);
        }
        else {
            res.json({ "status": 200 });
        }
    })
}

module.exports.loginUser = function (req, res) {
    console.log(req.body.emailid, req.body.psw);
    suserschm.findOne({ "email": req.body.emailid, "psw": req.body.psw }, (err, data) => {
        if (data == null) {
            res.json({ "status": 404, msg: { str1: 'Incorrect Username or Password.', str2: 'User not found.' } });
        }
        else {

            jwt.sign({ UserId: data._id }, 'TopSecret', { expiresIn: 60 * 60 }, (err, token) => {
                if (err) {
                    res.send(err);
                }
                else {
                    console.log(token);
                    res.json({
                        "status": 200, token: token, msg: {
                            str1: 'Successfully LoggedIn',
                            str2: '',
                        },
                        data:data

                    });
                }
            });
        }
    });

}




module.exports.goOnline = (user_id, socket_id) => {
    console.log("id : "+user_id)
    Users.findByIdAndUpdate (user_id , { online: true, Socket_id: socket_id })
        .then((user) => {
            console.log("hello");
            return true;
        })
        .catch((err) => {
            console.log("hello");

            console.log(err);
            return false;
        });
}


module.exports.goOffline = (socket_id) => {
    Users.findOneAndUpdate({ Socket_id: socket_id }, { online: false })
        .then((user) => {
            console.log("testtesttesttest");
            return true;
        })
        .catch((err) => {
            console.log(err, "errorerrorerrorerror");
            return false;
        });
}



module.exports.forgotPass = async function (req) {
    let token = await passToken.generateToken(req.body.email);

    let account = await nodemailer.createTestAccount();
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'sdd.sdei@gmail.com',
            pass: 'SDEI#2017chdSDD'
        }
    });

    const mailOptions = {
        from: 'sdd.sdei@gmail.com', // sender address
        to: req.body.email, // list of receivers
        subject: 'Reset Password', // Subject line
        html: `<h3>Your password reset token is valid for two hours only! Don't share it with anyone.<h3>
            <br/><a href="http://localhost:4200/forgotpassword?token=${token}" target="_blank">Change Password<a>`
    };

    let info = await transporter.sendMail(mailOptions);
    if (info) {
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }
}



module.exports.resetPass = function (req, res) {
    jwt.verify(req.token, 'TopSecret', (err, authdata) => {
        if (err) {
            res.json({ "status": 403, msg: { str1: 'Session Expired or Unauthorized access', str2: '' } });
        }
        else {

            Users.findOneAndUpdate({ email: authdata.email }, { Password: req.body.password }, (err, data) => {
                if (err) {
                    res.json({ "status": 403, msg: { str1: 'Failed', str2: '' } });
                }
                else {
                    res.json({ "status": 200, msg: { str1: 'Password Updated SuccessFully', str2: '' } });
                }
            })
        }
    })

}



module.exports.getOnlineUsers = function (req, res, next) {
    console.log(req.body,"dfhghfgjhbgjfgbf");
    jwt.verify(req.token, 'TopSecret', (err, authdata) => {
        if (err) {
            res.json({ "status": 403, msg: { str1: 'Session Expired or Unauthorized access', str2: '' } });
        }
        else {
            console.log("authdata",authdata)
            Users.find({ _id: { $ne: authdata.UserId } }, "fullname online").then((data) => {
                if (data == null) {
                    res.json({ status: 404, data: null });
                }
                else {
                    console.log(data);
                    res.json({ status: 200, data: data });
                }
            }).catch(err => { res.send(err) });
        }
    });
}


module.exports.getMessages = function (req, res, next) {

    console.log(req.body)
    Chats.findOne(req.body).then(data => {
        console.log(data);
        res.json({ status: 200, data: data.messages });
    }).catch(err => {
        res.send(err);
    });
}



const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/uploads');
    },
    filename: function (req, file, callback) {
        let filename = file.originalname.split('.')[0] + '-' + Date.now() + '-' + 'ozora' + path.extname(file.originalname);
        console.log(filename, "tteesstteg");

        callback(null, filename);
    }
});
// Multer function
var upload = multer({
    storage: storage
}).array('Files', 8);




module.exports.uploadFiles = function (req, res, next) {

    upload(req, res, (err) => {
        if (err) {
            console.log(err, "eeeerrrrrrrooorr");
            res.json({ data: null });
        }
        else {
            let filenames=[];

            console.log(req.files, "ttteeeesssttt");
            async function ops() {
                for (i = 0; i < req.files.length; i++) {
                    await filenames.push(req.files[i].filename);
                }
            }
            ops().then(()=>{
            res.json({ "status": 200, filename: filenames });

            }).catch((err)=>res.send(err));
        }
    });
}


