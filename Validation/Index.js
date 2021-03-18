exports.productValidation = (req,res,next) =>{
    
    req.check('product_name','product name is required').notEmpty();
    req.check('product_price','price is required').notEmpty()
    .matches(/\d/)
    .withMessage('price must be a number');
    req.check('product_description','product description should not be empty')
       .isLength({min:20,max:250})
    req.check('product_quantity','quantity should be in integer').notEmpty()
    .matches(/\d/)
    .withMessage('quantity should be a number')
    req.check('product_rating','Rating must be a number between 0 and 5')
       .isFloat({min:1,max:5});


    const errors = req.validationErrors();
    if(errors){
        const anyErrors = errors.map(error =>error.msg)
            return res.status(400).json([anyErrors])
    }
    next();
}  

