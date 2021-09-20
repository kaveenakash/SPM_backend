const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const bcrypt = require("bcryptjs");
const uuid = require("uuid");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { OAuth2Client } = require("google-auth-library");
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
  console.log(email)
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

module.exports = {
  SignUp,
  Login,
  GoogleLogin,
};
