
const Electronic = require("../models/Electronic");
const HttpError = require("../models/http-error");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const uuid = require("uuid");

const StoreElectronicListing = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  try {
    const {
      name,
      email,
      tpNumber,
      district,
      area,
      description, 
      date, 
      price,
      title,
      electronicCategory,
      condition,
      manufacture,
      models,
      color,
      
    } = req.body;
    console.log(price)
    const newElectronicData = new Electronic({
      name: name,
      tpNumber: tpNumber,
      email: email,
      date:date,
      district: district,
      area: area,
      description: description,
      images: ["http://localhost:9090/" + req.file.path],
      listingType:'electronic',
      title,
      price:price,
      electronicCategory:electronicCategory,
      condition:condition,
      manufacture:manufacture,
      models:models,
      color:color

    });
    console.log(newElectronicData)
    const result = await newElectronicData.save();
    console.log(result)
    return res.status(200).json(result)

  } catch (error) {
    new HttpError("Unexpected Error Occurs.", 422)
  }
};

const getAllElectronicData = async (req, res, next) => {
  
  try {
    const electronicData = await Electronic.find()
    return res.status(200).json(electronicData)
    console.log(electronicData)
  } catch (error) {
    
  }

};


const getElectronicById = async(req,res,next) =>{

  
  const id = req.params.id
  console.log(id) 
  try {
    const electronicData = await Electronic.findById(id)
    return res.status(200).json(electronicData)

  } catch (error) {
    
  }
}

module.exports = {
    StoreElectronicListing,
    getAllElectronicData,
    getElectronicById
};
