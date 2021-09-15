const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const checkAuth = require('../middleware/check-auth')
const fileUpload = require('../middleware/file-upload')
const {SignUp} = require('../controllers/AuthController')


router.post("/signup",SignUp)


module.exports = router  