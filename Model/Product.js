const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema


const productSchema = new mongoose.Schema({

        product_name:{
            type: String,
            required: true,
            trim: true,
            maxlength:50
        },

        product_price:{
            type:Number,
            required: true,
            trim: true,
            maxlength:20
        },

        product_description:{
            type: String,
            required: true,
            minlength: 20
        },

        product_quantity:{
            type:Number,
            required:true,
        },

        product_rating:{
            type:Number,
            min:1,
            max:5
        },

        product_image:{
            type: String,
            required:true
        },
        //category ko chiz aba product anusar pathaune kaaam
        category:{
            type:ObjectId,  //objectID chein database ko category bata line ho
            required:true,
            ref:'Category',
        },

},{timestamps:true})  //kaile create gareko ani kaile data aako herna ko lai timestamp chahieko


module.exports = mongoose.model('Product',productSchema) //product chein database ko schema ho