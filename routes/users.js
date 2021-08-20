const express = require('express');
const passport = require('passport');
const router =  express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const users = require('../controllers/users');

//Shows register page and handle signup 
router.route('/register')

    .get(users.renderRegister)
    .post(catchAsync( users.register));

//Shows login page and handle login 
router.route('/login')

    .get( users.renderLogin)
    .post( passport.authenticate('local',{failureFlash:true, failureRedirect:'/login'}),users.login);

//Logout route
router.get('/logout',users.logout)



module.exports = router;