const Joi = require('joi');
const Post = require('../models/postModels');
const HttpStatus = require('http-status-codes');
const User = require('../models/userModels');
module.exports =  {
    AddPost(req, res) {
        const schema = Joi.object().keys({
            post: Joi.string().required(), 
    });
    const  { error } = Joi.validate(req.body,schema);
    if(error && error.details) {
        return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ msg: error.details })
    }
    const body = {
        user: req.user._id,
        username: req.user.username,
        post: req.body.post,
        created: new Date()
    };
    
    Post.create(body)
    .then(async(post) => {
        await User.update(
            {
            _id: req.user._id
        },
        {
            $push: {
             posts: {
             postId: post._id,
             post: req.body.post,
             created: new Date()

            }
        }
        }
        );
        res.
        status(HttpStatus.OK)
        .json({ message:'Post created', post });
    })
    .catch(err => {
        res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Error Occured' });
    });
},
async GetAllPosts(req,res) {
try {
    const posts = await Post.find({})
    .populate('user') 
    .sort({created: -1}); //sorted newest to oldest
    return res.status(HttpStatus.OK).json({message: 'All posts', posts});
} catch (err) {
    return res
    .status(HttpStatus.INTERNAL_SERVER_ERROR)
    .json({message: 'Error occured'});
}
}

};