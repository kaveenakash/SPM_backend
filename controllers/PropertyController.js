
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

    // await user.propertyListings.push(newPropertyData)
    // await user.save()

    return res.status(200).json(result)

  } catch (error) {
    new HttpError("Unexpected Error Occurs.", 422)
  }
};

const getAllPropertyData = async (req, res, next) => {
  
  try {
    const propertyData = await Property.find({PermissionStatus:"approved"})
    return res.status(200).json(propertyData)

  } catch (error) {
    
  }

};
const getAllPendingPropertyData = async (req, res, next) => {
  
  try {
    const propertyData = await Property.find({PermissionStatus:"pending"})
    return res.status(200).json(propertyData)

  } catch (error) {
    
  }

};
const getAll = async (req, res, next) => {
  
  try {
    const propertyData = await Property.find({})
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
const removeProperty = async(req,res,next) =>{

  
  const {id} = req.body 
  console.log(id)
  try {
    const propertyData = await Property.deleteOne({_id:id})
    return res.status(200).json(propertyData)

  } catch (error) {
    
  }
}

const approveProperty = async(req,res,next) =>{

  
  const id = req.params.id

  const filter = { _id: id };
  const update = { PermissionStatus: "approved" };

  try {
    let response = await Property.findOneAndUpdate(filter, update, {
      new: true,
    });
    return res.status(200).json(response)
  } catch (err) {
    
    const error = new HttpError("Unexpected Error Occured", 503);
    return next(error);
  }


  
}


module.exports = {
    StorePropertyListing,
    getAllPropertyData,
    getPropertyById,
    removeProperty,
    approveProperty,
    getAll,
    getAllPendingPropertyData
};
