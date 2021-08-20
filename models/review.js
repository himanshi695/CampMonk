const mongoose = require('mongoose');
const { campgroundSchema } = require('../schemas');
const Schema = mongoose.Schema;

//Review Schema
const reviewSchema = new Schema ({
    // Setting the field type
    body: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

//Compiling review schema into the Model
module.exports = mongoose.model('Review', reviewSchema);