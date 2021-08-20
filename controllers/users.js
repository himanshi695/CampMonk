const User = require('../models/user');

// Show register form
module.exports.renderRegister = (req,res)=>{
    res.render('users/register')
}

//Handle signup logic
module.exports.register = async(req,res,next)=>{
    try{
    // Create User object
    const { email , username, password} = req.body;
    const user = new User({email, username});
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err=>{
        if(err) return next(err);
        req.flash('success','Welcome to Camp Monk!');
        res.redirect('/campgrounds');
    })
    
    } catch (e){
        //If already exist user then show error
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

//Show login form 
module.exports.renderLogin = (req,res)=>{
    res.render('users/login');
}

//Handle login logic
module.exports.login = (req,res)=>{
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

//logout form 
module.exports.logout =  (req,res)=>{
    req.logout();
    req.flash('success', 'Goodbye!');
    res.redirect('/campgrounds');
}