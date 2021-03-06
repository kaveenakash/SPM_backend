const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const bcrypt = require("bcryptjs");
const uuid = require("uuid");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Property = require("../models/Property");
const Message = require("../models/Message");
const Vehicle = require("../models/Vehicle");
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
    .json({ userId: createdUser.id, email: createdUser.email, token: token,fname:fname,lname:lname });
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
    fname:existingUser.fname,
    lname:existingUser.lname,
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


const getUserListings = async(req,res) => {
  const { userId } = req.body;
  const user=await User.findOne({_id:userId})
  .populate('propertyListings')
  .populate('vehicleListings')
  .then((result) => {
    console.log(result)
    res.json(result);
  })
  .catch((error) => {
    res.status(500).json({ error });
  });
  
};

const removePropertyListings = async(req,res) => {
  const { userId,itemId } = req.body;
  const user=await User.findOne({_id:userId})
  await user.propertyListings.pull(itemId)
  await Property.deleteOne({_id:itemId})
  const result = await user.save()
  // console.log(result)
  
};
const removeVehicleListings = async(req,res) => {
  const { userId,itemId } = req.body;
  console.log(itemId)
  const user=await User.findOne({_id:userId})
  await user.vehicleListings.pull(itemId)
  await Vehicle.deleteOne({_id:itemId})
  const result = await user.save()
  console.log(result)
  
};




const StoreMessage = async (req, res, next) => {
 
  try {
    const {
      name,
      email,
      message,
      userId
    } = req.body;
    const newMessage = new Message({
      name: name,
      email: email,
     message:message,
      userId:userId
    });
  
    const result = await newMessage.save();
    // const user = await User.findOne({_id:userId})


      let user = await User.findOneAndUpdate(
  
        { _id: userId },
  
        { $push: {message:result._id}},
  
        { new: true }
  
      );

    // await user.propertyListings.push(newPropertyData)
    // await user.save()

    return res.status(200).json(result)

  } catch (error) {
    new HttpError("Unexpected Error Occurs.", 422)
  }
};




const GetMessage = async(req,res) => {
  const { userId } = req.body;
  const user=await User.findOne({_id:userId})
  .populate('message')
  .then((result) => {
    res.json(result);
  })
  .catch((error) => {
    res.status(500).json({ error });
  });
  
};


const SaveReplyMessage = async(req,res) =>{
  const { messageId,replyMessage } = req.body;
  console.log(messageId)
  console.log(replyMessage)
  
  try {
    
    let message = await Message.findOneAndUpdate(

      { _id: messageId },

      { $push: {replyMessage:replyMessage}},

      { new: true }

    );
    return res.status(200).json(message)
  } catch (error) {
    return res.status(500),json(error)
  }

  // await user.propertyListings.push(newPropertyData)
  // await user.save()

}

module.exports = {
  SignUp,
  Login,
  GoogleLogin,
  DeleteUser,
  UpdatePassword,
  DisplayUserData,
  getUserListings,
  removePropertyListings,
  removeVehicleListings,
  StoreMessage,
  GetMessage,
  SaveReplyMessage
};
