const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const checkAuth = require('../middleware/check-auth')
const fileUpload = require('../middleware/file-upload')
const {StoreVehicleListing,getAllVehicleData,getVehicleById} = require('../controllers/VehicleController')


router.post('/add-vehicle',fileUpload.single('image'),StoreVehicleListing)
router.get('/get-all-vehicle',getAllVehicleData)
router.get('/get-vehicle/:id',getVehicleById)


module.exports = router  