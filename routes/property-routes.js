const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const checkAuth = require('../middleware/check-auth')
const fileUpload = require('../middleware/file-upload')
const {StorePropertyListing,getAllPropertyData,getPropertyById} = require('../controllers/PropertyController')


router.post('/add-property',fileUpload.single('image'),StorePropertyListing)
router.get('/get-all-property',getAllPropertyData)
router.get('/get-property/:id',getPropertyById)


module.exports = router  