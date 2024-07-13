const dbconfig=require("../config/dbconfig");
const mongoose =require("mongoose");
//to ensure consistency in promise handling of mongoose configuration
mongoose.Promise=global.promise;

const db={};
db.mongoose=mongoose;
db.url=dbconfig.url;
db.employees=require("./userModel");

module.exports=db;