const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    
    name:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    grade:{
        type:String,
    },
    previousRegNumber:{
        type:String,
    },
    gender:{
        type:String,
    },
    telNumber:{
        type:String
    }

},{timestamps:true})


const User = mongoose.model("User",userSchema)

module.exports = User