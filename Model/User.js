const mongoose = require('mongoose');
const uuidv1 = require('uuidv1');
const crypto = require('crypto');
 
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    hashed_password: {
        type: String,
        required: true,
    },
    salt: String,

    //for admin role and user role
    role:{
        type: Number,
        default : 0
    },
    isVerified:{
        type:Boolean,  //for yes or no qsn
        default:false
    },

},{timestamps:true});
userSchema.virtual('password')
        .set(function (password) {
            this._password=password //temporary variable
            this.salt=uuidv1()
            this.hashed_password=this.passwordEncrypt(password) //aayeko password encrypt garna {password->encrypt->hashing->stored}
        })
        .get(function () {
            return this._password
            
        })

userSchema.methods = {
    authenticate: function (plainText) {
        return this.passwordEncrypt(plainText) == this.hashed_password;
    

    },
    passwordEncrypt: function (password) {
        if(!password) return ''
        try {
            return crypto
            .createHmac('sha1',this.salt)
            .update(password)
            .digest('hex')
        } 
        catch (error) {
            return ''
        }
    }
}
 

module.exports = mongoose.model('user',userSchema)
