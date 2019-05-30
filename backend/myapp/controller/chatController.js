const Chat = require('../models/chatZone');
const User = require('../models/registered');


//Socket Controller Functions
module.exports.sendMessage = (data, io, socket) => {
    console.log(data);
    Chat.findOneAndUpdate({ chatRoom: data.room }, { $push: { messages: data } },{new:true})
        .then(chat => {

            User.findById(data.sendToId).then(user => {
                if (user.online == true) {
                    console.log("user is online");
                    User.findById(data.sendToId).then(user => {
                        if (user.online == true) {
                            console.log("user is online");
                            Chat.findOneAndUpdate({ chatRoom: data.room },
                                { $set: { "messages.$[i].messageStatus": { status: 'delivered' } } },
                                { arrayFilters: [{ "i.messageStatus.status": 'sent' }], new: true })
                                .then(chat => {
                                    console.log("chat updated");
                                    io.in(data.room).emit('messageReceived', chat);
                                })
                        }
                    })
                }
                else {
                    console.log("user is offline",chat);
                    io.in(data.room).emit('messageReceived', chat);
                }
            })
        })
}

module.exports.sendfile = (data, io, socket) => {


    console.log("testdebugtestdebugtestdebugtestdebug",data);
    // msgs =new Chat(data);
    // Chat.aggregate()
    Chat.findOneAndUpdate({ chatRoom: data.room }, { $push: { messages: data.data } })
        .then(chat => {
            console.log(chat,"testdebugtestdebug",data)
                    Chat.findOne({ chatRoom: data.room }).then(res=>{
                        console.log("user is onine",res);
                        io.in(data.room).emit('messageReceived', res);
                    })
                   
                }).catch(err => res.send(err));
}


