const Listing = require('./models/listing');
const Review = require('./models/review.js');
const ExpressError = require('./utils/ExpressError.js');
const {reviewSchema, listingSchema} = require('./schema.js')

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in!");
        return res.redirect('/login');
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(! listing.owner.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the owner of this listing")
        return res.redirect(`/listings/${id}`)
    }
    next();
}


module.exports.validateListing = (err, req, res, next) => {
    let {error} = listingSchema.validate(req.body)
    // console.log(result);

    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, error);
    }else{
        next();
    }
}


module.exports.validateReview = (err, req, res, next) => {
    let {error} = reviewSchema.validate(req.body)
    // console.log(result);

    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, error);
    }else{
        next();
    }
}


module.exports.isReviewAuthor = async (req, res, next) => {
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(! review.author.equals(res.locals.currUser._id)){
        req.flash("error", "You cannot delete this Review")
        return res.redirect(`/listings/${id}`)
    }
    next();
}
