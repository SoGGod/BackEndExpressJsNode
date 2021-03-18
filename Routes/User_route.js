const express = require('express');

const router = express.Router();
const { postUser, signIn,signOut, userById, userInfo, requiresignIn, authorizedUser, confirmMail, resendVerificationMail, sendForgotPassword, checkTokenForPasswordreset, changePassword} = require('../Controller/User_controller');



router.post('/postuser',postUser);
router.post('/signin',signIn);
router.get('/signout',signOut);
router.post('/confirmation/:userToken',confirmMail)
router.post('/resendverificationmail',resendVerificationMail);
router.get('/userinfo/:userId',requiresignIn,authorizedUser,userInfo);
router.post('/sendforgotpassword',sendForgotPassword);
router.put('/resetpassword/:userToken',checkTokenForPasswordreset)
router.put('/changepassword',requiresignIn,changePassword)


router.param('userId',userById);  //id matra khojeko hai yaha
module.exports = router