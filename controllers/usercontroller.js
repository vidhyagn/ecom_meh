import userModel from '../models/userModel.js';
import orderModel from '../models/orderModel.js'
import {comparePassword, hashPassword} from '../helpers/authHelper.js';
import JWT from 'jsonwebtoken';

//to register user
export const registUser = async (req, res) => {
    try {
        // Extracting values from req.body
        const { username, emailid, password, shippingaddress,answer} = req.body;

        // Validation
        if (!username) {
            return res.status(400).send({ message: 'name is required' });
        }
        if (!emailid) {
            return res.status(400).send({ message: 'emailid is required' });
        }
        if (!password) {
            return res.status(400).send({ message: 'password is required' });
        }
        if (!shippingaddress) {
            return res.status(400).send({ message: 'shippingaddress is required' });
        }
        if (!answer) {
            return res.status(400).send({ message: 'answer is required' });
        }
        

        // Check if user already exists
        const existingUser = await userModel.findOne({ emailid });

        // If user already exists
        if (existingUser) {
            return res.status(409).send({
                success: false,
                message: 'Already registered please login',
            });
        }
        //register user
        const hashedPassword = await hashPassword(password);
        
        // Creating new user
        const user = await new userModel({
            username,
            emailid,
            password : hashedPassword,
            shippingaddress,
            answer
        }).save();
        
        //save
        return res.status(201).json({
            success:true,
            message:"User registered Successfully",
            user,
        });
        
    } catch (error) {
        console.log("Error in registering user:",error);
        return res.status(500).json({ error: 'An error occurred while registering the user.' });
    }
};

//POST Login
export const loginUser = async(req,res)=>{
   try {
         const {emailid,password}=req.body

         //validation
          if(!emailid || !password){
            return res.status(404).send({
                success:false,
                message:"Invalid emailid or password"
            })
          }
    //check user
    const user=await userModel.findOne({emailid})
    if(!user){
        return res.status(404).send({
            success:false,
            message:"Emailid is not registered"
        })
    }
    
          const match=await comparePassword(password,user.password)
          
          if(!match){
            return res.status(401).send({
                success:false,
                message:"Invalid password"
            });
          }
          
          //token
          const token=await JWT.sign({_id:user._id},process.env.JWT_SECRET,{
            expiresIn:"7d",
        });
          res.status(200).send({
            success:true,
            message:"Login Successfully",
            user:{
                _id:user._id,
            username:user.username,
            emailid:user.emailid,
            password:user.password,
            shippingaddress:user.shippingaddress,
            role:user.role,
            },
            token,
          });

   } catch (error) {
    console.log(error);
    res.status(500).send({
        success:false,
        message:"Error in Login",
        error,
    });
   }  
};

//ForgotPasswordController

export const ForgotPasswordController=async(req,res)=>{
   try {
    const {emailid,answer,newPassword}=req.body;
    if(!emailid){
        res.status(400).send({message:'Emailid is required'})
    }
    if(!answer){
        res.status(400).send({message:'answer is required'})
    }
    if(!newPassword){
        res.status(400).send({message:'New password is required'})
    }

    //check
    const user =await userModel.findOne({emailid,answer});
    
    //validation
    if(!user){
        return res.status(404).send({
            success:false,
            message:"Wrong emailid or answer"
        });
    }
    const hashed=await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id,{password:hashed});

    res.status(200).send({
        success:true,
        message:"Password Reset Successfully",
    });
   } catch (error) {
    console.log(error)
    res.status(500).send({
        success:false,
        message:"Something went Wrong",
        error,
    });
   }
};

//test user
export const testUser=(req,res)=>{
    try{
    res.send("Protected Route");
}catch(error){
    console.log(error);
    res.send({error});
}
};

//update profile
export const updateProfileController=async(req,res)=>{
    try {
        const {username,emailid,password,shippingaddress}=req.body
        const user = await userModel.findById(req.user._id)
        //check password
        if(!password && password.length < 6){
           return res.json({error:"Password is required and 6 characters long"})
        }
        const hashedPassword=password ? await 
        hashPassword(password):undefined

        const updateUser = await userModel
        .findByIdAndUpdate(req.user._id,{
            username:username||user.username,
            password:hashedPassword||user.password,
            shippingaddress:shippingaddress||user.shippingaddress
        },{new:true})
        res.status(200).send({
            success:true,
            message:"Profile updated successfully",
            updateUser
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success:false,
            message:'Error while updating profile',
            error
        })
    }
}

//orders
export const getOrdersController=async(req,res)=>{
     try {
        const orders=await orderModel.find({buyer:req.user._id})
        .populate("products","-photo")
        .populate("buyer","username")
     } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error while getting orders",
            error
        })
     }
}

//All orders
export const getAllOrdersController=async(req,res)=>{
    try {
       const orders=await orderModel.find({})
       .populate("products","-photo")
       .populate("buyer","username")
       .sort({createdAt:"-1"})
    } catch (error) {
       console.log(error)
       res.status(500).send({
           success:false,
           message:"Error while getting orders",
           error
       })
    }
}

//order status
export const orderStatusController=async(req,res)=>{
    try {
        const {orderId}=req.params;
        const {status}=req.body
        const orders=await orderModel.findByIdAndUpdate
        (orderId,{status},
            {new:true});
            res.json(orders);
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error while updating Order",
            error
        })
    }
}
