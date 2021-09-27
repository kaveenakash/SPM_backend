const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const checkAuth = require('../middleware/check-auth')
const fileUpload = require('../middleware/file-upload')
const {StoreElectronicListing,getAllElectronicData,getElectronicById} = require('../controllers/ElectronicController')


router.post('/add-electronic',fileUpload.single('image'),StoreElectronicListing)
router.get('/get-all-electronic',getAllElectronicData)
router.get('/get-electronic/:id',getElectronicById)


module.exports = router  