const express = require('express');
const router = express.Router();
const WrapAsync = require('../utils/WrapAsync.js');
const Listing = require('../models/listing.js');
const {isLoggedIn, isOwner, validateListing} = require('../middleware.js');
const listingController = require('../controllers/listings.js');

router.route('/')
    .get(WrapAsync(listingController.index));


router.route('/new')
    .get(isLoggedIn, listingController.renderNewForm)
    .post(isLoggedIn, validateListing, WrapAsync(listingController.createListing));

router.route('/:id')
    .get(WrapAsync(listingController.showListing))
    .delete(isLoggedIn, isOwner, WrapAsync(listingController.deleteListing));

router.route('/:id/edit')
    .get(isLoggedIn, isOwner, WrapAsync(listingController.showEditListingPage))
    .put(isLoggedIn, isOwner, validateListing, WrapAsync(listingController.updateListing));


module.exports = router;