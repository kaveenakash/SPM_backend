const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();
const app = express();
const HttpError = require("./models/http-error");

const vehicleRoutes = require("./routes/vehicle-routes");
const propertyRoutes = require("./routes/property-routes");
const authRoutes = require('./routes/auth-routes')

app.use(cors());
app.use(express.json());
app.use("/uploads/images", express.static(path.join("uploads", "images"))); 

app.use("/api/vehicle", vehicleRoutes);
app.use("/api/property", propertyRoutes);
app.use("/api/auth",authRoutes)
//404 Error
app.use((req, res, next) => {
  const error = new HttpError("could not find this route", 404);
  throw error;
});

//Error Handling
app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }

  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code | 500);
  res.json({ message: error.message || "An unknown error occured" });
});

const port = process.env.PORT || 9090;


mongoose
.connect('mongodb://kaveen:kaveen@spm-shard-00-00.ndmlt.mongodb.net:27017,spm-shard-00-01.ndmlt.mongodb.net:27017,spm-shard-00-02.ndmlt.mongodb.net:27017/SPM?ssl=true&replicaSet=atlas-lm0y5p-shard-0&authSource=admin&retryWrites=true&w=majority',{useUnifiedTopology:true,useCreateIndex:true,useNewUrlParser:true,useFindAndModify:true})
.then(() =>{
    console.log('Database Estabilished')
    app.listen(port ,() =>{
        console.log('Server Started ',9090)
    })
})
.catch(err =>{
    console.log(err) 
}) 

