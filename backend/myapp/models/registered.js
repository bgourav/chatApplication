const mongoo = require('mongoose');
const Schema = mongoo.Schema;

userSchema = new Schema({
  
    fullname:{
        type:String,
        require:true,
    },
    email:{
        type:String,
        require:true,
    },
    psw:{
        type:String,
        require:true,
    },
    rpsw:{
        type:String,
        require:true,
    },
    online:{
        type:Boolean,
        default:false,
        require:true,
    },
    Socket_id:String
},
    {
        timestamps:true
});
  
var gourav = mongoo.model('gchatregis', userSchema);
module.exports=gourav; 
 
