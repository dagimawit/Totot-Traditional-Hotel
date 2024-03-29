const config = require('config');
const  jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required: true,
        trim: true,
        minlength:3,
        maxlength:50,
    },
    email:{
        type: String,
        required:true,
        unique: true,
        minlength:5,
        maxlength:50,
    },
    password:{
        type: String,
        required: true,  
        minlength:8,
        maxlength:1024 ,
    },
    isAdmin: {
        type:Boolean,
        default: false,
    },  
    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Food'
      },
})
userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id:this._id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'));
    return token;
}


const usersModel = mongoose.model('User', userSchema);

function validateusers(user){
    const userSchema = Joi.object({
        name:Joi.string().min(3).max(50).required(),
        email:Joi.string().min(5).max(50).required().email(),
        password:Joi.string().min(8).max(1024).required(),
        isAdmin:Joi.boolean(),
    });
    return userSchema.validate(user);
}
module.exports = {
    validateusers,
    usersModel,
    userSchema,
    generateAuthToken: userSchema.methods.generateAuthToken,
  };