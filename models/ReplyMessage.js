const mongoose = require('mongoose')
const Schema = mongoose.Schema

const replyMessageSchema = new Schema({
    
   
    replyMessage:{
        type:String,
        required:true
    },
   messageId:{
        type:String,
    },
    
},{timestamps:true})


const ReplyMessage = mongoose.model("ReplyMessage",replyMessageSchema)

module.exports = ReplyMessage