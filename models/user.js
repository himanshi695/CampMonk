const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

//User schema setup
const UserSchema = new Schema({
    email: {
        type:String,
        required : true,
        unique: true
    }
});

UserSchema.plugin(passportLocalMongoose);

//Compiling schema into model
module.exports = mongoose.model('User', UserSchema);