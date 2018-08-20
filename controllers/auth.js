const User = require('../models/userModels');
const Helpers = require('../Helpers/helpers');
const dbConfig = require ('../config/secret');
const Joi = require('joi');
const HttpStatus = require('http-status-codes');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


module.exports = {
    async CreateUser(req,res){
    const schema = Joi.object().keys({
        username: Joi.string()
        .min(5)
        .max(10)
        .required(),
        email: Joi.string()
        .email()
        .required(),
        password: Joi.string()
        .regex(/^[a-zA-Z0-9]{3,30}$/).
        required(),
       /*  password: Joi.string()
        .min(5)
        .required() */
    });
    const { error, value } = Joi.validate(req.body, schema);

    if(error && error.details) {
    return res
    .status(HttpStatus.BAD_REQUEST)
    .json({ message: error.details })
}

const userEmail = await User.findOne({email: Helpers.lowerCase(req.body.email) 
});
if(userEmail) {
    return res.status(HttpStatus.CONFLICT).json({ message: 'Email already exists'});
}
const userName = await User.findOne({username: Helpers.firstUpper(req.body.username)});
if(userName){
    return res.status(HttpStatus.CONFLICT).json({message: 'Username already exists'});
}
return bcrypt.hash(value.password, 10, (err,hash) =>{
if(err) {
    return res
    .status(HttpStatus.BAD_REQUEST)
    .json({ message: 'Error hashing password'});
}
//new object 
const body = {
    username: Helpers.firstUpper(value.username),
    email: Helpers.lowerCase(value.email),
    password: hash

};
User.create(body).then((user) => {
    const token = jwt.sign({ data:user }, dbConfig.secret, {
        expiresIn: 120
    });
res.cookie('auth',token);
    res
    .status(HttpStatus.CREATED)
    .json({message: 'User created successfully', user, token});
})
.catch(err => {
    return res
    .status(HttpStatus.INTERNAL_SERVER_ERROR)
    .json({message: 'Error occured'});
});
});
},
}  
