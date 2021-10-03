
const Property = require("../models/Property");
const HttpError = require("../models/http-error");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const uuid = require("uuid");

const StorePropertyListing = async (req, res, next) => {
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
      date,
      area,
      advertismentType,
      price,
      title,
      propertyCategory,
      propertyType,
      size,
      description, 
      userId
    } = req.body;
    console.log(price)
    const newPropertyData = new Property({
      name: name,
      tpNumber: tpNumber,
      email: email,
      date:date,
      district: district,
      advertismentType:advertismentType,
      area: area,
      description: description,
      images: ["https://spmsliit.herokuapp.com/" + req.file.path],
      listingType:'property',
      title,
      price:price,
      propertyCategory:propertyCategory,
      propertyType:propertyType,
      size:size,
      userId:userId
    });
    console.log(newPropertyData)
    const result = await newPropertyData.save();
    console.log(result)
    return res.status(200).json(result)

  } catch (error) {
    new HttpError("Unexpected Error Occurs.", 422)
  }
};

const getAllPropertyData = async (req, res, next) => {
  
  try {
    const propertyData = await Property.find()
    return res.status(200).json(propertyData)
    console.log(propertyData)
  } catch (error) {
    
  }

};


const getPropertyById = async(req,res,next) =>{

  
  const id = req.params.id
  console.log(id) 
  try {
    const propertyData = await Property.findById(id)
    return res.status(200).json(propertyData)

  } catch (error) {
    
  }
}

module.exports = {
    StorePropertyListing,
    getAllPropertyData,
    getPropertyById
};
