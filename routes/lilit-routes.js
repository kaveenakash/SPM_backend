const express = require("express");
const router = express.Router();

const {SaveStudentData,getStudentRegNumber} = require('../controllers/LilitController')


router.post('/save-student',SaveStudentData)
router.post('/get-reg-number',getStudentRegNumber)



module.exports = router  