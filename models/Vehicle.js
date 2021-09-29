const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const vehicleSchema = new Schema(
  {
    name: { type: String, required: true },
    tpNumber: { type: String },
    email: { type: String},
    date:{type:String},
    district: { type: String, required: true },
    area: { type: String, required: true },
    description: { type: String, required: true },
    images:{type:Array},
    listingType: { type: String, enum: ["services", "property",'electronic',"vehicle","other"], default: "other" },
    title:{type: String},
    totalPrice:{type:String},
    vehicleType:{type: String},
    manufacturer:{type: String},
    model:{type: String},
    vehicleCondition:{type:String}, 
    modelYear:{type:String},
  },
  { timestamps: true }
); 

  
const Vehicle = mongoose.model("Vehicle", vehicleSchema);

module.exports = Vehicle;
 



