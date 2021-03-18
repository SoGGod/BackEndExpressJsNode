const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema

const orderSchema = new mongoose.Schema({

        orderItems:[{
                type:ObjectId,
                required:true,
                ref:'OrderItem'
        }],
        shippingAddress:{
            type:String,
            required:true,
        },
        PhoneNo:{
            type:Number,
            required:true
        },
        city:{
            type:String,
            required:true,
        },
        country:{
            type:String,
            required:true,
        },
        user:{
            type:ObjectId,
            required:true,
            ref:'user'
        },
        status:{
            type:String,
            default:'pending'
        },
        orderAt:{
            type:Date,
            default:Date.now(),

        },
        shippingFee:{
            type:Number,
            required:true
        },
        totalPrice:{
            type:Number,
            default:0
        },

})
module.exports = mongoose.model('Order',orderSchema)
