const express = require("express");
const router = express.Router();
const{check} = require("express-validator");

const checkAuth = require('../middleware/check-auth')
const fileUpload = require('../middleware/file-upload')
const {StoreServiceListing,getAllServiceData,getServiceById} = require('../controllers/ServiceController')

router.post('/add-service',fileUpload.single('image'), StoreServiceListing)
router.get('/get-all-service', getAllServiceData)
router.get('/get-service/:id',getServiceById)

module.exports = router