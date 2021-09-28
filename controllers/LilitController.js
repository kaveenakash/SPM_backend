const User = require("../models/User");
const HttpError = require("../models/http-error");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const uuid = require("uuid");

const SaveStudentData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  try {
    const {
      name,
      address,
      grade,
      previousRegNumber,
      gender,
      telNumber
    } = req.body;

    const newUser = new User({
        name,
        address,
        grade,
        previousRegNumber,
        gender,
        telNumber,
      
    });
    const result = await newUser.save();
    console.log(result);
    return res.status(200).json(result);
  } catch (error) {
    new HttpError("Unexpected Error Occurs.", 422);
  }
};

const getStudentRegNumber = async (req, res, next) => {
    if (!errors.isEmpty()) {
        return next(
          new HttpError("Invalid inputs passed, please check your data.", 422)
        );
      }
  try {
    const {
        telNumber
      } = req.body;
    const userData = await User.find({telNumber:telNumber});
    return res.status(200).json(userData);
  } catch (error) {}
};



module.exports = {
    SaveStudentData,
    getStudentRegNumber
 
};
