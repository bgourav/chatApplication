const jwt = require('jsonwebtoken');

module.exports.generateToken= function(email)
{
    return jwt.sign({ email : email },'TopSecret', { expiresIn: 60 * 60 });
}
