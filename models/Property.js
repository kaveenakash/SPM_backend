const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const propertySchema = new Schema(
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
    advertismentType:{type:String},
    title:{type: String},
    propertyCategory:{type: String},
    propertyType:{type: String},
    size:{type:String},
   
  },
  { timestamps: true }
); 

  
const Property = mongoose.model("Property", propertySchema);

module.exports = Property;
 



