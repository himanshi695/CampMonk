const User = require('../models/user');

// Authorization Routes
// Show register form
module.exports.renderRegister = (req,res)=>{
    res.render('users/register')
}

//Handle signup
module.exports.register = async(req,res,next)=>{
    try{
    const { email , username, password} = req.body;
    // Create User object
    const user = new User({email, username});
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err=>{
        if(err) return next(err);
        req.flash('success','Welcome to Camp Monk!');
        res.redirect('/campgrounds');
    })

    } catch (e){
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

//Show login-page
module.exports.renderLogin = (req,res)=>{
    res.render('users/login');
}

//Login Post form
module.exports.login = (req,res)=>{
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

//Logout route
module.exports.logout =  (req,res)=>{
    req.logout();
    req.flash('success', 'Goodbye!');
    res.redirect('/campgrounds');
}