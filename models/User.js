const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    
    fname:{
        type:String,
        required:true
    },
    lname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    propertyListings:[{type:Schema.Types.ObjectId,ref:'Property'}],
    vehicleListings:[{type:Schema.Types.ObjectId,ref:'Vehicle'}],
    message:[{type:Schema.Types.ObjectId,ref:'Message'}],
    
},{timestamps:true})


const User = mongoose.model("User",userSchema)

module.exports = User