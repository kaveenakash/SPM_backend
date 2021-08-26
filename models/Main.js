const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const basciSchema = new Schema(
  {
    name: { type: String, required: true },
    tpNumber: { type: String },
    email: { type: String},
    district: { type: String, required: true },
    area: { type: String, required: true },
    description: { type: String, required: true },
    images:{type:Array},
    listingType: { type: String, enum: ["services", "property",'electronic',"vehicle","other"], default: "other" },
   
  },
  { timestamps: true } 
);

// basciSchema.plugin(uniqueValidator); 

const BasicData = mongoose.model("BasicData", basciSchema);

module.exports = BasicData;




