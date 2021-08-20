const express = require('express');
const passport = require('passport');
const router =  express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const users = require('../controllers/users');

// Authorization Routes
// Show register form
//HANDLE SIGNUP
router.route('/register')

    .get(users.renderRegister)
    .post(catchAsync( users.register));

// Show login form
//HANDLE LOGIN
router.route('/login')

    .get( users.renderLogin)
    .post( passport.authenticate('local',{failureFlash:true, failureRedirect:'/login'}),users.login);

//LOGOUT ROUTE
router.get('/logout',users.logout)



module.exports = router;