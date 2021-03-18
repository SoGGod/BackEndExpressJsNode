const OrderItem = require('../Model/OrderItem')
const Order = require('../Model/Order')

exports.postOrderItem = (req,res) =>{
    let newOrderItem=new OrderItem({
		quantity:req.body.quantity,

		productId:req.body.productId
	})
	newOrderItem.save((error,orderitem)=>{
		if(error|| !orderitem){
			return res.status(400).json({error:'something went wrong'})
		}
		res.json({orderitem})
	})

}


exports.postOrder= async (req,res)=>{

  const orderitem = req.body.orderItems
  const totalPrices = await Promise.all(orderitem.map(async(orderItemId) =>{

    const orderItem = await  OrderItem.findById(orderItemId).populate('productId','product_price');
    const totalPrice = orderItem.productId.product_price*orderItem.quantity;
    return(totalPrice)
  }))
  
      const totalPrice = totalPrices.reduce((a,b) => a+b,0)
   
    let order = new Order({
        orderItems: req.body.orderItems,
        shippingAddress: req.body.shippingAddress,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        PhoneNo: req.body.phoneNo,
        status: req.body.status,
        totalPrice:totalPrice + (req.body.shippingFee),
        shippingFee:req.body.shippingFee,
        user: req.params.userId,  //directly userid pass garne 
    })
     await order.save((error,order)=>{
     	if(!order)
    return res.status(400).json({error:error})

    res.json({order});
     });   
}


exports.getOrderList=(req,res)=>{  //admin le herne kaam ho
	Order.find().populate('user','name').exec((error,order)=>{
		if(!order || error){
			return res.status(400).json({error:error})

		}
		res.json({order})
	})
}

exports.getOrder=(req,res)=>{
	Order.findById(req.params.id)
   .populate({path:'user',select:'name'})
     //.populate('orderItems')
    // .populate({path:'orderItems',populate:'productId'})
   .populate({
   path:'orderItems',populate:{path:'productId',populate:'category'}
  })
	.exec((error,order)=>{
if(error || !order){
	return res.status(400).json({error:"order not found"})
}
res.json({order})
	})
	
}

exports.getOrderForCurrentUser=(req,res)=>{
	Order.find({user:req.params.userId})
   .populate({path:'user',select:'name'})
     //.populate('orderItems')
    // .populate({path:'orderItems',populate:'productId'})
   .populate({
   path:'orderItems',populate:{path:'productId',populate:'category'}
  })
	.exec((error,order)=>{
if(error || !order){
	return res.status(400).json({error:"order not found"})
}
res.json({order})
	})
	
}

exports.updateStatus = (req,res) =>{
  Order.findByIdAndUpdate(req.params.id,{status:req.body.status},{new:true}, //naya data jana paro vane new:true aako findbyidandupdate ma
  (error,data) =>{
    if(error||!data){
      return res.status(400).json({error:"cannot update status"})
    }
    return res.json({message:"order status updated"})
  }
  )
}

exports.deleteOrder=(req, res)=>{
  Order.findByIdAndRemove(req.params.id).then(async order =>{
      if(order) {
          await order.orderItems.map(async orderItem => {
              await OrderItem.findByIdAndRemove(orderItem)
          })
          return res.status(200).json({message: 'the order is deleted!'})
      } else {
          return res.status(404).json({ message: "order not found!"})
      }
  }).catch(err=>{
     return res.status(400).json({error: err}) 
  })
}