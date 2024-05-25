const express = require('express');
const router = express.Router({mergeParams : true});
const WrapAsync = require('../utils/WrapAsync.js');
const {listingSchema} = require('../schema.js')
const Review = require('../models/review.js');
const {reviewSchema} = require('../schema.js')
const Listing = require('../models/listing.js')
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware.js');
const reviewsController = require('../controllers/reviews.js');


//Post review route
router.post('/', isLoggedIn, validateReview, WrapAsync(reviewsController.postReview));

//Delete review routw
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, WrapAsync(reviewsController.deleteReview));

module.exports = router;