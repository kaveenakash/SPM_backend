const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const checkAuth = require('../middleware/check-auth')
const fileUpload = require('../middleware/file-upload')
const {StoreVehicleListing,getAllVehicleData,getVehicleById,removeVehicle,getAllPendingVehicleData,approveVehicle,removeProperty} = require('../controllers/VehicleController')


router.post('/add-vehicle',fileUpload.single('image'),StoreVehicleListing)
router.get('/get-all-vehicle',getAllVehicleData)
router.get('/get-pending-vehicle',getAllPendingVehicleData)
router.get('/get-vehicle/:id',getVehicleById)
router.post('/remove-vehicle',removeVehicle)
router.put('/approve-vehicle/:id',approveVehicle)
router.post('/remove-vehicle',removeVehicle)


module.exports = router  