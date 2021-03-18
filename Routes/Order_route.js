const express=require('express')
const router=express.Router()
const { postOrder, postOrderItem, getOrderList, getOrder,getOrderForCurrentUser, updateStatus } = require('../Controller/OrderItem&Order_controller')
const { requiresignIn, checkAdmin, userById} = require('../Controller/User_controller');


router.post('/postorderitem/:userId',requiresignIn,postOrderItem)
router.post('/postorder/:userId',requiresignIn,postOrder)
router.get('/orderlist/:userId',requiresignIn,checkAdmin,getOrderList)
router.get('/getorder/:id',requiresignIn,checkAdmin,getOrder)
router.get('/getorderforcurrentuser/:userId',requiresignIn,getOrderForCurrentUser)
router.put('/updatestatus/:id/:userId',requiresignIn,checkAdmin,updateStatus)  //:id vanne chein order ko id ho hai
router.delete('/deleteorder/:id/:userId',requiresignIn,updateStatus)

router.param('userId',userById);
module.exports=router
