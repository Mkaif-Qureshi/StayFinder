const express = require('express');
const router = express.Router();
const User = require('../models/user');
const WrapAsync = require('../utils/WrapAsync');
const ExpressError = require('../utils/ExpressError');
const passport = require('passport');
const {saveRedirectUrl} = require("../middleware.js");
const userController = require('../controllers/users.js');

router.get('/signup' , userController.signupPage);

router.post('/signup' , WrapAsync(userController.signupUser));


router.get('/login', userController.loginPage);

router.post('/login', 
    saveRedirectUrl, 
    passport.authenticate('local', { failureRedirect: '/login', failureFlash : true, }), 
    userController.loginUser
);

router.get('/logout', userController.logout);

module.exports = router;