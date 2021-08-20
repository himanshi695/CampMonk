const Campground = require('../models/campground');
const Review = require('../models/review');

// Reviews Create
module.exports.createReview = async( req, res)=>{
    //lookup campground using ID
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    //add author username/id and associated campground to the review
    review.author = req.user._id;
    campground.reviews.push(review);
    //save review
    await review.save();
    //save campground
    await campground.save();
    req.flash('success', 'Created new review!');
    //Redirect back to the campground.id page
    res.redirect(`/campgrounds/${campground._id}`);
}

//Review delete
module.exports.deleteReview = async(req,res)=>{
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull:{reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Successfully deleted review!');
    //Redirect back to the campground.id page
    res.redirect(`/campgrounds/${id}`);
}