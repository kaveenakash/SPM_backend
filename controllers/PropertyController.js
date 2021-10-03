
const Property = require("../models/Property");
const User = require("../models/User");
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
  
    const result = await newPropertyData.save();
    // const user = await User.findOne({_id:userId})


      let user = await User.findOneAndUpdate(
  
        { _id: userId },
  
        { $push: {propertyListings:result._id}},
  
        { new: true }
  
      );
        console.log(user)

    // await user.propertyListings.push(newPropertyData)
    // await user.save()

    return res.status(200).json(result)

  } catch (error) {
    new HttpError("Unexpected Error Occurs.", 422)
  }
};

const getAllPropertyData = async (req, res, next) => {
  
  try {
    const propertyData = await Property.find()
    return res.status(200).json(propertyData)

  } catch (error) {
    
  }

};


const getPropertyById = async(req,res,next) =>{

  
  const id = req.params.id

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
