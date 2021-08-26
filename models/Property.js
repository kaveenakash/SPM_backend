const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const propertySchema = new Schema(
  {
    advertismentType:{type: String},
    title:{type: String},
    propertyCategory:{type: String},
    propertyType:{type: String},
    size:{type:String},
    totalPrice:{type:String},
    basicData:[{type:Schema.Types.ObjectId,ref:'BasicData'}]
  },
  { timestamps: true }
);

basciSchema.plugin(uniqueValidator);

const Property = mongoose.model("Property", basciSchema);

module.exports = Property;




