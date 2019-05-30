var express = require('express');
var appcontrol = require('../controller/appController');
var router = express.Router();


/* GET users listing. */
router.post('/register',appcontrol.createUser);
router.post('/login', appcontrol.loginUser);
router.get('/onlineusers',verifyToken,appcontrol.getOnlineUsers);
router.post('/getmsg',appcontrol.getMessages);
router.post('/upload',appcontrol.uploadFiles);
router.post('/forgotpass',appcontrol.forgotPass);
router.post('/resetpass',verifyToken,appcontrol.resetPass);


function verifyToken(req,res,next)
{
    const bearerHeader = req.headers['authorization'];
    console.log(bearerHeader);
    if(typeof bearerHeader !== undefined)
    {
        
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token=bearerToken;
        console.log(req.token);
        next();
    }
    else{
        res.json({"status":403,msg: {str1:'Session Expired or Unauthorized access', str2: ''}})
    }
}

module.exports = router;


