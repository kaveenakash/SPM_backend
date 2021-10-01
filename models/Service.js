const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const serviceSchema = new Schema(
    {
    name: { type: String, required: true },
    tpNumber: { type: String },
    email: { type: String},
    date:{type:String},
    district: { type: String, required: true },
    area: { type: String, required: true },
    price:{type:String,required:true},
    description: { type: String, required: true },
    images:{type:Array},
    listingType: { type: String, enum: ["services", "property",'electronic',"vehicle","other"], default: "other" },
    serviceType:{type:String},
    title:{type: String},
    ratings:{type: String},
    price:{type: String},
  
    },{ timestamps: true }
    ); 
    
    const Service = mongoose.model("Service", serviceSchema);

    module.exports = Service;