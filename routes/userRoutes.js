import express from 'express';
import  {registUser,loginUser,testUser, ForgotPasswordController, updateProfileController, getOrdersController, getAllOrdersController, orderStatusController}  from '../controllers/usercontroller.js';
import { requireSignIn,isAdmin } from '../middlewares/authMiddleware.js';
import jwt from 'jsonwebtoken'; 
import userModel from '../models/userModel.js';

//router object
 const router=express.Router()

 //routing
 //Register ,method POST
 router.post('/register',registUser)

 //Login ,method POST
 router.post('/login',loginUser)

 //Forgotpassword , method POST
 router.post('/forgot-password',ForgotPasswordController)

 //test routes
 router.get('/test',requireSignIn,isAdmin,testUser)

 //protected user-route auth
 router.get('/user-auth',requireSignIn,(req,res)=>{
    res.status(200).json({ok:true});
 });

 //protected admin-route auth
 router.get('/admin-auth',requireSignIn,isAdmin,(req,res)=>{
   res.status(200).json({ok:true});
});

//update profile
router.get('/profile',requireSignIn,updateProfileController)

//orders
router.get('/orders',requireSignIn,getOrdersController)

//All orders
router.get('/all-orders',requireSignIn,isAdmin,getAllOrdersController)

//order status update
router.put("/order-status/:orderId",requireSignIn,isAdmin,orderStatusController)

export default router;

// {
//    "name": "grocery-shopping",
//    "version": "1.0.0",
//    "description": "",
//    "scripts": {
//      "start": "node server/server.js",
//      "server": "nodemon server/server.js",
//      "client": "npm start --prefix client",
//      "client-install": "npm install --prefix client",
//      "install-all": "npm install && npm run client-install",
//      "dev": "concurrently \"npm run server\" \"npm run client\""
//    },
//    "keywords": [],
//    "author": "Meharunnisa",
//    "license": "MIT",
//    "dependencies": {
//      "bcrypt": "^5.1.1",
//      "braintree": "^3.23.0",
//      "cors": "^2.8.5",
//      "dotenv": "^16.4.5",
//      "express": "^4.19.2",
//      "express-formidable": "^1.2.0",
//      "jsonwebtoken": "^9.0.2",
//      "mongodb": "^6.5.0",
//      "mongoose": "^8.2.4",
//      "morgan": "^1.10.0",
//      "multer": "^1.4.5-lts.1",
//      "nodemon": "^3.1.0",
//      "slugify": "^1.6.6",
//      "concurrently": "^7.0.0"
//    },
//    "devDependencies": {
//      "gh-pages": "^6.1.1"
//    }
//  }
 