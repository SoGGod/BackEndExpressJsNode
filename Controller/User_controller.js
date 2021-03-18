const User = require('../Model/User')
const Jwt = require('jsonwebtoken')
const expressjwt = require('express-jwt')
const crypto = require('crypto')
const Token = require('../Model/Token')
const { token } = require('morgan')
const sendEmail = require('../Utils/VerifyEmail')


exports.postUser=(req,res)=>{

    const user = new User(req.body); //request bata data aako vayera req.body vako ho
    User.findOne({email:user.email},(err,data)=>{
        if(data==null){
            user.save((error,result) =>{
                if(error){
                   return res.status(400).json({msg:'something went wrong'})
                }
                const token = new Token({
                    userId : result._id,
                    token : crypto.randomBytes(16).toString('hex')
                })
                token.save((error,token) =>{
                    if(error){
                       return res.status(400).json({error:error})
                    }
           
            sendEmail({
                from:'no-reply@webapplication.com',
                to:result.email,
                subject:'Email verification message',
                text: 'Hello,\n\n Please verify your account by clicking the below link \n\n' + req.headers.host+'/\api\/confirmation\/'+token.token
            })
        })
               return res.json({result})    
                })

        }
        else{
           return res.status(400).json({msg:'similar email already stored'})
        }

    })
   
}

exports.signIn = (req,res) =>{

    const {email,password} =req.body
    User.findOne({email},(error,user)=>{
        if(error || !user){
           return res.status(400).json({error:'user with this email does not exist'})
        }
        if(!user.authenticate(password)){
           return res.status(400).json({error:'email or password does not match'})
        }
        if(!user.isVerified){
           return res.status(400).json({error:'please verify yyour account before logging in'})
        }
        const token = Jwt.sign({_id:user._id},process.env.JWT_SECRET )    //user ko id ani uta .env ma vako excret name bata token generate garne ho
        res.cookie('ab',token,{expire:new Date() + 9999})
        //array destructuring
        const {_id,role,email} =user           //sign in paxi user data dekhauna yo ani esko tala ko line
        res.json({token,user:{_id,role,email}})
    })

}
//middleware sigin nagare details herna napaune
exports.requiresignIn = expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    userProperty: "auth"
})

//to pass id on the route
exports.userById=(req,res,next,id) =>{
    User.findById(id).exec((error,user) =>{
        if(error || !user){
          return   res.status(400).json({error:"user not found"})
        }
        req.profile=user
        next();
    })
}

exports.userInfo = (req,res) =>{
    req.profile.salt = undefined
    req.profile.hashed_password = undefined   //hide hashed password and salt
  
}
 //only signedin id can see the profile other can't
exports.authorizedUser = (req,res,next) =>{
    if(req.profile._id != req.auth._id){
 
       return  res.json({error:"not authorized"})
    }
    next();
}


exports.signOut = (req,res) =>{
    res.clearCookie('ab')
    res.json('signout success')
}

exports.checkAdmin = (req,res,next) =>{

    if(req.profile.role ===0){
   
       return  res.status(400).json({error:"only admin is authorized"})
    }
    next();
}

exports.confirmMail = (req,res) =>{

        Token.findOne({token:req.params.userToken},(error,token) =>{
                if(!token){
                    res.status(400).json({error:'invalid token or token may have expired'})
                }
        User.findOne({
                _id:token.userId,
                email:req.body.email
        
        },(error,user) =>{
            if(!user){
                res.status(400).json({error:'the email you provided is not assiciated with this token'})

        }
            if(user.isVerified) return res.status(400).json({error:'email is already verified,Please Login'})
            user.isVerified =true
            user.save((error,result) =>{
                if(error){
                    res.status(400).json({error:'the email is not verified yet'})
                }
                res.json({message:'Email is verified successfully, Please go ahead and login'})
        
            })
       })
    })

}


exports.resendVerificationMail = (req,res) =>{

        User.findOne({email:req.body.email},(error,user) =>{
            if(User.isVerified)
            res.json({message:'Email is verified successfully, Please go ahead and login'})

            const token = new Token({
                userId : user._id,
                token : crypto.randomBytes(16).toString('hex')
            })
            sendEmail({
                from:'no-reply@webapplication.com',
                to:user.email,
                subject:'Email verification message',
                text: 'Hello,\n\n Please verify your account by clicking the below link \n\n' + req.headers.host+'/\api\/confirmation\/'+token.token
            })
            res.json({message:'try checking your mail again'})

        })

}

exports.sendForgotPassword = (req,res) =>{

    User.findOne({email:req.body.email},(error,user)=>{
        if(!user){
           return res.status(400).json({error:'user with this email does not exist'})
        }
    const token = new Token({
        userId : user._id,
        token : crypto.randomBytes(16).toString('hex')
    })
    .save((error,token) =>{
        if(error){
            return res.status(400).json({error:'something'})
        }
        sendEmail({
            from:'no-reply@webapplication.com',
            to:user.email,
            subject:'Forgot Password',
            text: 'Hello,\n\n Please reset your password by clicking the below link \n\n' + req.headers.host+'/\api\/resetpassword\/'+token.token
        })
    })
    
    res.json({message:'check your mail'})  

})

}

exports.checkTokenForPasswordreset = (req,res) =>{
 
    Token.findOne({token:req.params.userToken},(error,token) =>{
        if(!token){
            res.status(400).json({error:'invalid token or token may have expired'})
        }
        User.findOne({
            _id:token.userId,
            email:req.body.email
    
    },(error,user) =>{
        if(!user){res.status(400).json({error:'the email you provided is not assiciated with this token'})}

        user.password = req.body.password
        user.save((error,result) =>{
        if(error){
            res.status(400).json({error:'invalid token'})
        }
        res.status(400).json({message:'password is reset successfully'})
    })

         })
    })

}

exports.changePassword = (req,res) =>{
const user_detail=User.findOne({_id:req.auth._id})
.then((user)=>{
    if(!user){
        return res.json({err:"You are not signed in"})
    }
    if(user.authenticate(req.body.password)){
        user.password=req.body.newpassword
    user.save()
    .then((data)=>{
        res.json({message:"Password Changed"})
    })
    }
    else{
        res.json("Old password does not match")
    }
    
})
}