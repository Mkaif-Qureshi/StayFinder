const User = require('../models/user');

module.exports.signupPage = (req, res) => {
    res.render('users/signup.ejs');
}


module.exports.signupUser = async(req, res) => {
    try {
        let {username, email, password} = req.body;
        const newUser = new User({email, username});

        const registeredUser = await User.register(newUser, password);
        // console.log(registeredUser);

        //login after signup
        req.login(registeredUser, (err) => {
            if(err){ return next(err); }
            req.flash("success", "Welcome to StayFinder");
            res.redirect('/listings');
        });

    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/signup");
    }
}


module.exports.loginPage = (req, res) => {
    res.render('./users/login.ejs')
}


module.exports.loginUser = async(req, res) => {
    req.flash("success", "Welcome to StayFinder! You are logged in");
    res.redirect(res.locals.redirectUrl ?? '/listings');
}

module.exports.logout = (req, res) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    })
}

