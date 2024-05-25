const express = require('express');
const router = express.Router();
const User = require('../models/user');
const WrapAsync = require('../utils/WrapAsync');
const ExpressError = require('../utils/ExpressError');
const passport = require('passport');
const {saveRedirectUrl} = require("../middleware.js");
const userController = require('../controllers/users.js');


router.route('/signup')
    .get(userController.signupPage)
    .post(WrapAsync(userController.signupUser));


router.route('/login')
    .get(userController.loginPage)
    .post( 
        saveRedirectUrl, 
        passport.authenticate('local', { failureRedirect: '/login', failureFlash : true, }), 
        userController.loginUser
    );

router.get('/logout', userController.logout);

module.exports = router;