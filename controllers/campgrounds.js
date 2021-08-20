const Campground =  require('../models/campground');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken  = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken : mapBoxToken});
const { cloudinary } = require('../cloudinary');

// INDEX ROUTE
// This is how we see the data
module.exports.index = async (req,res) =>{
    const campgrounds=await Campground.find({});
    // Get all campgrounds from DB
    res.render('campgrounds/index', {campgrounds});
}

// This is page where we send/update the data
module.exports.renderNewForm =  (req,res) =>{
    res.render('campgrounds/new');
}

// Create a new campground and save to DB
module.exports.createCampground = async(req,res, next)=>{
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f=> ({url : f.path, filename: f.filename}))
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}

// Show more info about one campground
module.exports.showCampground = async(req,res)=>{
    // find the campground with the provided ID
    const campground = await Campground.findById(req.params.id).populate({path : 'reviews', populate : {
        path: 'author'
    }
    }).populate('author');
    console.log(campground);
    if(!campground){
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    // render the show template with that campground
    res.render('campgrounds/show', {campground});
}

module.exports.renderEditForm =async(req,res)=>{
    // Find the Campground by Id
    const { id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    // Third Render the edit page in order to access to the edit form
    res.render('campgrounds/edit', {campground});
}

module.exports.updateCampground = async(req,res) => {

    const {id} = req.params;
    console.log(req.body);
    // First find and update the correct campgrounds
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    const imgs= req.files.map(f=> ({url : f.path, filename: f.filename}));
    campground.images.push(...imgs);
    await campground.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: {$in : req.body.deleteImages}}}});
    }
    // Second redirect to the show page. We need to add the Id.
	// We can use req.params.id or updatedCampground._id
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}

// Remove all the associated Comment and Review documents from the database when we delete the campground
module.exports.deleteCampground = async (req,res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    //delete the campground and render back to the campgrounds page
    req.flash('success','Successfully deleted Campground!');
    res.redirect('/campgrounds');
}