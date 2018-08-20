const express = require('express');
const router = express.Router();
//express middleware module

const AuthCtrl = require('../controllers/auth');
//auth is for authentication

router.post('/register', AuthCtrl.CreateUser);

module.exports = router;

//routers will be made available with export


