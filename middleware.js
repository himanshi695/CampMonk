// We moved the middleware from the routes to this separate file to uphold the principle of DRY code. It also helps with scalability.
const {campgroundSchema , reviewSchema} = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/review')

// Middleware: Authentication
module.exports.isLoggedIn = (req,res,next) =>{
    
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        req.flash('error', 'you must be signed in')
        return res.redirect('/login')
    }
    next();
}
// Middleware: Campground Authorization
module.exports.validateCampground  = (req,res,next) =>{
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else{
        next();
    }
}

module.exports.isAuthor = async (req,res,next)=>{
    //find the campground by id
    const { id } = req.params;
    const campground = await Campground.findById(id);
    // Verify that user owns the campground or is an Admin
    if(!campground.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

//Middleware : Review Authorization
module.exports.isReviewAuthor = async (req,res,next)=>{
    //find the campground by id 
    const {id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    //verify that user owns the review or is admin
    if(!review.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

// check if req.user._id exists in Campground.reviews
module.exports.validateReview = (req, res, next)=>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else{
        next();
    }
}
