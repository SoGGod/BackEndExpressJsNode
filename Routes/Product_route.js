const express = require('express');
const router = express.Router();
const {productValidation} = require('../Validation/Index')
const {postProduct, read,showProductById,deleteProduct,searchProduct} = require('../Controller/Product_controller');
const { requiresignIn, checkAdmin, userById } = require('../Controller/User_controller');
const imageUpload  = require('../Middleware/Fileupload');


router.post('/postproduct/:userId',requiresignIn,checkAdmin,imageUpload.single('product_image'),productValidation,postProduct);  //imageupload.single for single images and imageupload.multiple for multiples image uploading
// router.get('/details',read);
router.get('/details/:id',showProductById);
router.delete('/details/:id',deleteProduct);
router.get('/details',searchProduct);
// router.post('/postproduct',imageUpload.single('product_image'),productValidation,postProduct); //without admin sigin garikana product haalna
router.param('userId',userById);




module.exports = router;