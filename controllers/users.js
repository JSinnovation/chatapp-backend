const httpStatus = require('http-status-codes');

const User = require('../models/userModels')


module.exports = {
  async GetAllUsers(req, res) {
    await User.find({}) //will return all users
      .populate('post.postId')
      .populate('following.userfollowed')
      .populate('followers.follower')
      .then((result) => {
        res.status(httpStatus.OK).json({
          message: 'All users',
          result
        });
      })
      .catch(err => {
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .json({
            message: 'Error occured'
          });
      });
  },

  async GetUser(req, res) {
    await User.findOne({
        _id: req.params.id
      })
      .populate('post.postId')
      .populate('following.userfollowed')
      .populate('followers.follower')
      .then((result) => {
        res.status(httpStatus.OK).json({
          message: 'User by id',
          result
        });
      })
      .catch(err => {
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .json({
            message: 'Error occured'
          });
      });
  },
  async GetUserByName(req, res) {
    await User.findOne({
        username: req.params.username
      })
      .populate('post.postId')
      .populate('following.userfollowed')
      .populate('followers.follower')
      .then((result) => {
        res.status(httpStatus.OK).json({
          message: 'User by username',
          result
        });
      })
      .catch(err => {
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .json({
            message: 'Error occured'
          });
      });
  }



};