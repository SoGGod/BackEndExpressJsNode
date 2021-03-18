const Product = require('../Model/Product');
const { search } = require('../Routes/Product_route');
const APIFeatures = require('../Utils/apifeatures')


// to post or insert a new product
exports.postProduct=(req,res)=>{

    const product = new Product({

                product_name:req.body.product_name,
                product_price:req.body.product_price,
                product_description:req.body.product_description,
                product_quantity:req.body.product_quantity,
                product_rating:req.body.product_rating,
                product_image:req.file.path,
                category:req.body.category

    }); 
    Product.findOne({product_name:product.product_name},(err,data)=>{
        if(data==null){
            product.save()
            .then(products=>{ 
              
            res.json({products})
            })
            .catch(err=>{console.log(err)})
        }
        else{
            res.status(400).json({msg:'similar item already stored'})
        }

    })
   
}

//to show all of the products
exports.read = (req,res) =>{
    Product.find().sort({createdAt:-1})
    .then(products => {
        setTimeout(() => {
            res.json({products})     
        }, 2000);
        
    })
    .catch(err=>{console.log(err)})
}

//to show the product

exports.showProductById = (req,res) =>{
    const id = req.params.id
    Product.findById(id)
    .then(product => {
        res.json({product})
    })
    .catch(err=>{console.log(err)})
}
//to delete the product
exports.deleteProduct = (req,res) =>{
    const id = req.params.id
    Product.findByIdAndDelete(id)
    .then(products => {
        res.json({products})
    })
    .catch(err=>{console.log(err)})
}
//to search product
exports.searchProduct = async(req,res) =>{

    const apiFetaures = new APIFeatures(Product.find(),req.query)
    .search()
    const products = await apiFetaures.query;
    res.json({products})

}


