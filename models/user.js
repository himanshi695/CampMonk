const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

//User Schema
const UserSchema = new Schema({
    email: {
        type:String,
        required : true,
        unique: true
    }
});

/*
Using Passport-Local Mongoose:
  First you need to plugin Passport-Local Mongoose into your User schema
  You're free to define your User how you like. Passport-Local Mongoose will add a username, hash and salt field to store the username, the hashed password and the salt value.
  Additionally Passport-Local Mongoose adds some methods to your Schema. 
*/ 

UserSchema.plugin(passportLocalMongoose);

//Compiling schema into the Model
module.exports = mongoose.model('User', UserSchema);