const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cookie_parser = require('cookie-parser')
const expressValidator = require('express-validator');
const cors = require('cors');
require('dotenv').config();


const connection = require('./database/Connection');
const productRouter = require('./Routes/Product_route',);
const categoryRouter = require('./Routes/Category_route');
const userRouter = require('./Routes/User_route');
const orderRouter=require('./Routes/Order_route');

 


const app=express();
app.use(bodyParser.json());

app.use(morgan('dev'));   //dev means for develpoment mode only
app.use(expressValidator());
app.use(cookie_parser());
app.use(cors());



app.use('/api',productRouter)
app.use('/api',categoryRouter)
app.use('/api',userRouter)
app.use('/api',orderRouter)
app.use('/public/uploads/',express.static('public/uploads'));


const port=process.env.PORT;

app.listen(port,()=>{

    console.log(`server running on port ${port}`)
});

