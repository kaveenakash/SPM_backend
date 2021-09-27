const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const electronicSchema = new Schema(
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
    advertismentType:{type:String},
    title:{type: String},
    electronicCategory:{type: String},
    condition:{type: String},
    manufacture:{type:String},
    models:{type:String},
    color:{type:String},
    price:{type:String,required:true},
   
  },
  { timestamps: true }
); 

  
const Electonic = mongoose.model("Property", electronicSchema);

module.exports = Electonic;
 



