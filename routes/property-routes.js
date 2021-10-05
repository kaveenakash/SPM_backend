const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const checkAuth = require('../middleware/check-auth')
const fileUpload = require('../middleware/file-upload')
const {StorePropertyListing,getAllPropertyData,getPropertyById,removeProperty,approveProperty,getAll} = require('../controllers/PropertyController')


router.post('/add-property',fileUpload.single('image'),StorePropertyListing)
router.get('/get-all-property',getAllPropertyData)
router.get('/get-all',getAll)
router.get('/get-property/:id',getPropertyById)
router.post('/remove-property',removeProperty)
router.put('/approve-property/:id',approveProperty)


module.exports = router  