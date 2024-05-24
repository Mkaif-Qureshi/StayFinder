const express = require('express');
const router = express.Router({mergeParams : true});
const WrapAsync = require('../utils/WrapAsync.js');
const {listingSchema} = require('../schema.js')
const Review = require('../models/review.js');
const {reviewSchema} = require('../schema.js')
const Listing = require('../models/listing.js')

const validateReview = (err, req, res, next) => {
    let {error} = reviewSchema.validate(req.body)
    // console.log(result);

    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, error);
    }else{
        next();
    }
}


//Post review route
router.post('/', validateReview, WrapAsync(async(req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    // console.log(listing);
    // res.send('review saved');
    res.redirect(`/listings/${listing._id}`)
}))

//Delete review routw
router.delete('/:reviewId', WrapAsync(async(req, res) => {
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull : { reviews : reviewId }})
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}))


module.exports = router;