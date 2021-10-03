const Vehicle = require("../models/Vehicle");
const User = require("../models/User");

const HttpError = require("../models/http-error");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const uuid = require("uuid");

const StoreVehicleListing = async (req, res, next) => {
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
      manufacturer,
      model,
      modelYear,
      price,
      title,
      vehicleCondition,
      vehicleType,
      description,
      userId
    } = req.body;

    const newVehicleData = new Vehicle({
      name: name,
      tpNumber: tpNumber,
      email: email,
      date: date,
      district: district,
      area: area,
      description: description,
      images: ["https://spmsliit.herokuapp.com/" + req.file.path],
      listingType: "vehicle",
      title,
      totalPrice: price,
      vehicleType,
      manufacturer,
      model,
      vehicleCondition,
      modelYear,
      userId:userId
    });
    const result = await newVehicleData.save();

    let user = await User.findOneAndUpdate(
  
      { _id: userId },

      { $push: {vehicleListings:result._id}},

      { new: true }

    );

    return res.status(200).json(result);
  } catch (error) {
    new HttpError("Unexpected Error Occurs.", 422);
  }
};

const getAllVehicleData = async (req, res, next) => {
  try {
    const vehicleData = await Vehicle.find();
    return res.status(200).json(vehicleData);
  } catch (error) {}
};

const getVehicleById = async (req, res, next) => {
  const id = req.params.id;
  console.log(id);
  try {
    const vehicleData = await Vehicle.findById(id);
    return res.status(200).json(vehicleData);
  } catch (error) {}
};

module.exports = {
  StoreVehicleListing,
  getAllVehicleData,
  getVehicleById,
};
