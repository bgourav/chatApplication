const mong = require('mongoose');
const Schema = mong.Schema;


const MsgSchema = new Schema({
    sendToName : String,
    sendToId : Schema.Types.ObjectId,
    userNameFrom : String,
    messageType : String,
    message : {
        type : String,
        required : true
    },
    image :{
        type: String 
    },
    messageStatus :{
            status : String,
            time : { type : Date, default: Date.now }
    } 
},{
    timestamps : true
});

var Chat = new Schema({
    chatRoom : String,
    members : {
       type: [Schema.Types.ObjectId ],
       ref : 'chatusers'
    },
    messages : [MsgSchema]
})

module.exports = mong.model('chatZone',Chat);

