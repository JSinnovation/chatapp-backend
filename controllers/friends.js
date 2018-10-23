const HttpStatus = require('http-status-codes');

const User = require('../models/userModels');

module.exports = {
    FollowUser(req, res) {
      const FollowUser = async () => {
        await User.update({
          _id: req.user._id,
          'following.userFollowed': {
            $ne: req.body.userFollowed
          }
        }, {
          $push: {
            following: {
              userFollowed: req.body.userFollowed
            }
          }
        });

        await User.update({
          _id: req.body.userFollowed,
          'following.follower': {
            $ne: req.user._id
          }
        }, {
          $push: {
            followers: {
              follower: req.user._id
            },
            notifications: {
              senderId: req.user._id,
              message: `${req.user.username} is now following you.`,
              created: new Date(),
              viewProfile: false
            }
          }
        });
      };

      FollowUser()
        .then(() => {
          res.status(HttpStatus.OK).json({
            message: 'Following user now'
          })
        })
        .catch(err => {
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Error Occured'
          })
        });
    }, //note the comma separator

    UnFollowUser(req, res) {
      const UnFollowUser = async () => {
        await User.update({
          _id: req.user._id,
        }, {
          $pull: {
            following: {
              userFollowed: req.body.userFollowed
            }
          }
        });

        await User.update({
          _id: req.body.userFollowed,
        }, {
          $pull: {
            followers: {
              follower: req.user._id
            }
          }
        });
      };

      UnFollowUser()
        .then(() => {
          res.status(HttpStatus.OK).json({
            message: 'Unfollowing User Now'
          })
        })
        .catch(err => {
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Error Occured'
          });
        });
    },
    async MarkNotification(req, res) {
      if (!req.body.deleteValue) {
        await User.updateOne({
          _id: req.user._id,
          'notifications._id': req.params.id
        }, {
            $set: {
              'notifications.$.read': true
            }
          })
          .then(() => {
            res.status(HttpStatus.OK).json({
              message: 'Marked as read'
            });
          })
          .catch(err => {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
              message: 'Error Occured'
            });
          });
      } else {
        await User.update(
          {
            _id: req.user._id,
            'notifications._id': req.params.id
          }, {
            $pull: {
              notifications: {
                _id: req.params.id
              }
            }
          }).then(() => {
            res.status(HttpStatus.OK).json({
              message: 'Deleted Successfully'
            });
          })
          .catch(err => {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
              message: 'Error Occured'
            });
          });
          }
  },
    
  async MarkAllNotifications(req, res) {
    await User.update({
      _id: req.user._id
    },
    //$set is a function from MongoDB
      { $set: { 'notifications.$[elem].read': true } },
      { arrayFilters: [{ 'elem.read': false }], multi: true }
      //arrayfilters is a MongoDB function
    ).then(() => {
      res.status(HttpStatus.OK).json({
        message: 'Marked all successfully'
      });
    })
    .catch(err => {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error Occured'
      });
    });
    }
   };