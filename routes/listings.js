const express = require('express');
const router = express.Router();
const WrapAsync = require('../utils/WrapAsync.js');
const Listing = require('../models/listing.js');
const {isLoggedIn, isOwner, validateListing} = require('../middleware.js');
const listingController = require('../controllers/listings.js');

// index route
router.get('/', WrapAsync(listingController.index));

// new route
router.get('/new', isLoggedIn, listingController.renderNewForm);

//craete route
router.post('/new', isLoggedIn, validateListing, WrapAsync(listingController.createListing));

//show route
router.get('/:id', WrapAsync(listingController.showListing));

//edit route
router.get('/:id/edit', isLoggedIn, isOwner, WrapAsync(listingController.showEditListingPage));

//update route
router.put('/:id/edit', isLoggedIn, isOwner, validateListing, WrapAsync(listingController.updateListing));

//delete route 
router.delete('/:id', isLoggedIn, isOwner, WrapAsync(listingController.deleteListing));

module.exports = router;