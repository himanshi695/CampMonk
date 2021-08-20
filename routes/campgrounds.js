const express= require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');

const {isLoggedIn, isAuthor, validateCampground} = require('../middleware'); // Note that the default file in a directory is index.js. Therefore, we don't need to write out ("../middleware/index.js")
const multer= require('multer');
const {storage} = require('../cloudinary');
const upload = multer({ storage })

const Campground = require('../models/campground');

// INDEX ROUTE
// This is how we see the data
// Note that the post request and the get request share the same url, but they are different routes. We could name them differently, but this is part of the naming convention of REST.
// get data from form and add to campgrounds array
router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn,
        upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground));
 
// NEW ROUTE
// This is page where we send/update the data
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

// SHOW ROUTE
// Show more info about one campground
// It's important that the show route is written after the new route. Otherwise, this code will treat "/campgrounds/new" as an id
router.route('/:id')

    .get(catchAsync(campgrounds.showCampground))   
    .put( isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync( campgrounds.updateCampground))
    .delete( isLoggedIn, isAuthor, catchAsync( campgrounds.deleteCampground ));

// EDIT ROUTE
// Third Render the edit page in order to access to the edit form
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));



module.exports = router;