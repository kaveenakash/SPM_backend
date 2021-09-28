const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const bcrypt = require("bcryptjs");
const uuid = require("uuid");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { OAuth2Client } = require("google-auth-library");
const { response } = require("express");
const client = new OAuth2Client(
  "496877226261-ut83ih6oniovoejte0f1qu2slhltjjhb.apps.googleusercontent.com"
);

const SignUp = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { fname, lname, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }
  if (existingUser) {
    const error = new HttpError(
      "User exists already, please login instead.",
      422
    );
    return next(error);
  }
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError("could not create user, Please try again", 500);
    return next(error);
  }

  const createdUser = new User({
    fname: fname,
    lname: lname,
    email: email,
    password: hashedPassword,
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Signing Up failed,Please try again", 500);
    return next(error);
  }

  let token;
  try {
    token = await jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      "supersecret_dont_share",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Signing Up failed,Please try again", 500);
    return next(error);
  }

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token });
};

// Login function
const Login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, Please try again later",
      500
      );
      return next(error);
    }
    if (!existingUser) {
      const error = new HttpError("Invalid credentials,could not log in", 401);
      return next(error);
    }
  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      "Could not log you in,Please check your credentials and try again",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError("Invalid credentials,could not log in", 401);
    return next(error);
  }
  let token;
  try {
    token = await jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      "supersecret_dont_share",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Login in failed,Please try again", 500);
    return next(error);
  }
  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token,
  });
};

// Google Login function
const GoogleLogin = async (req, res, next) => {
  const { tokenId } = req.body;
  client
    .verifyIdToken({
      idToken: tokenId,
      audience:
        "361577374258-c45jn6o7muma9cj62ptm5r7ivvtdfa8k.apps.googleusercontent.com",
    })
    .then((response) => {
      const { email_verified, name, email } = response.payload;
      if (email_verified) {
        User.findOne({ email }).exec((err, user) => {
          if (err) {
            return res.status(400).json({
              error: "Something went wrong",
            });
          } else {
            if (user) {
              const { _id, fname, lname, email } = user;
              const token = jwt.sign(
                { userId: _id, email: email },
                "supersecret_dont_share",
                { expiresIn: "1h" }
              );
              res.json({
                userId: _id,
                email: email,
                token: token,
                fname: fname,
                lname: lname,
              });
            } else {
              let password = email + process.env.JWT_SIGNIN_KEY;
              let newUser = new User({
                fname: name,
                lname: name,
                email,
                password,
              });
              newUser.save((err, data) => {
                if (err) {
                  return res.status(400).json({
                    error: "Something went wrong...",
                  });
                }
                const token = jwt.sign(
                  { userId: _id, email: email },
                  "supersecret_dont_share",
                  { expiresIn: "1h" }
                );
                const { _id, fname, lname, email } = newUser;
                res.status(200).json({
                  userId: _id,
                  email: email,
                  token: token,
                  fname: fname,
                  lname: lname,
                });
              });
            }
          }
        });
      }
    });
};

const DeleteUser = async(req,res) => {
  if(!req.body){
    new HttpError("Please provide user id", 422)
  }
  const {id}=req.body
  try{
  const response = await User.findOneAndRemove({_id:id})
  }catch (error){
    new HttpError("Can't delete user account", 422)
  }
  return res.status(200).json({
    response
  })
}

const UpdatePassword = async(req,res,next) => {
  const { id,previousPassword,newPassword} = req.body;
  const user=await User.findById(id)
  if(!user){
    new HttpError("User does not exist", 422)
  }
  if(!(user.password===previousPassword)){
    new HttpError("Password does not match", 422)
  }
  try{
  let hashedPassword = await bcrypt.hash(newPassword, 12)
  const filter = { _id: id };
  const update = { password: hashedPassword };
  let response = await User.findOneAndUpdate(filter, update, {new: true,})
  return res.status(200).json({
    data:response
  })
  }catch(error){
    new HttpError("Password update failed", 503)
  }


}


const DisplayUserData = async(req,res) => {
  const { id } = req.body;
  const user=await User.findById(id)
  console.log(user);
  if(!user){
    new HttpError("User does not exist", 422)
  }
      if (id) {
        User.findOne({ id }).exec((err, user) => {
          if (err) {
            return res.status(400).json({
              error: "Something went wrong",
            });
          } else {
            if (user) {
              const { _id, fname, lname, email } = user;
              res.json({
                userId: _id,
                email: email,
                token: token,
                fname: fname,
                lname: lname,
              });
            }
          }
        });
      }
      return res.status(200).json({
        response
        
      })
  
};

module.exports = {
  SignUp,
  Login,
  GoogleLogin,
  DeleteUser,
  UpdatePassword,
  DisplayUserData
};
