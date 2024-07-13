import dotenv from "dotenv";
//import required modules
import express from 'express';
import morgan from "morgan";
import {dbConnect} from "./config/dbconfig.js";
import userRoutes from './routes/userRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js'
import productRoutes from './routes/productRoutes.js'
import cors from 'cors';

dotenv.config();

const app=express();    //create an express application
const PORT=process.env.PORT || 8080;

//Connect mongodb to server
dbConnect();

// middlewares
app.use(cors(
  {
    origin:["https://my-ecommerce-grocery-app.vercel.app"],
    methods:["POST","GET","PUT","DELETE"],
    credentials:true
  }
));
app.use(express.json());
app.use(morgan('dev'))

//routes for user,category and products
app.use("/api/v1/auth",userRoutes);
app.use("/api/v1/category",categoryRoutes);
app.use("/api/v1/product",productRoutes);

// Root route
app.get('/api/v1', (req, res) => {
  res.send('Welcome to the Grocery Shopping API');
});

//start the server

app.listen(PORT,()=>{
    console.log(`Server is running on ${process.env.DEV_MODE} mode on port ${PORT}`);
});

// # REACT_APP_API=http://localhost:8080
// const API_BASE_URL =  'https://grocery-app-back-end-8.onrender.com';



