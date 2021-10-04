const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const checkAuth = require('../middleware/check-auth')
const fileUpload = require('../middleware/file-upload')
const {StoreMessage,SignUp,Login,GoogleLogin,DeleteUser,UpdatePassword,DisplayUserData,getUserListings,removePropertyListings,removeVehicleListings} = require('../controllers/AuthController')


router.post("/signup",SignUp)
router.post("/login",Login)
router.post('/google-login',GoogleLogin)
router.post('/delete-user',DeleteUser)
router.post('/update-password',UpdatePassword)
router.post('/display-user-data',DisplayUserData)


router.post('/get-user-listings',getUserListings)
router.post('/remove-property-listings',removePropertyListings)
router.post('/remove-vehicle-listings',removeVehicleListings)
router.post('/save-message',StoreMessage)
module.exports = router   