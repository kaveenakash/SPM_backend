const Service = require("../models/Service");
const HttpError = require("../models/http-error");
const bcrypt = require("bcryptjs");
const {validationResult} = require("express-validator");
const uuid = require("uuid");

const StoreServiceListing = async(req,res,next) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next(
            new HttpError("Invalid Inputs, please check your data", 422)
        );
    }
    try{
        const{name,
            email,
            tpNumber,
            district,
            date,
            area,
            title,
            serviceType,
            price,
            ratings,
            description, 
        } = req.body;
        console.log(price)
        const newServiceData = new Service({
            name: name,
            tpNumber: tpNumber,
            email: email,
            date:date,
            district: district,
            area: area,
            description: description,
            images: ["http://localhost:9090/" + req.file.path],
            listingType:'service',
            title,
            serviceType:serviceType,
            ratings:ratings,
            price:price

        });
        console.log(newServiceData)
        const result = await newServiceData.save();
        console.log(result)
        return res.status(200).json(result)
    } catch(error){
        new HttpError("Unexpected Error", 422)
    }
};

const getAllServiceData = async (req, res, next) => {

    try{
        const serviceData = await Service.find()
        return res.status(200).json(serviceData)
        console.log(serviceData)

    }catch(error){

    }
};

const getServiceById = async (req,res,next) => {

    const id = req.params.id
    console.log(id)
    try{
        const serviceData = await Service.findById(id)
        return res.status(200).json(serviceData)
    }catch (error){

    }
}

module.exports = {
    StoreServiceListing,
    getAllServiceData,
    getServiceById
};