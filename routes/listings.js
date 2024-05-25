const express = require('express');
const router = express.Router();
const WrapAsync = require('../utils/WrapAsync.js');
const Listing = require('../models/listing.js');
const {isLoggedIn, isOwner, validateListing} = require('../middleware.js');
const listingController = require('../controllers/listings.js');
const multer = require('multer')
const { storage } = require('../cloudConfig.js')
const upload = multer({ storage })

router.route('/')
    .get(WrapAsync(listingController.index));


router.route('/new')
    .get(isLoggedIn, listingController.renderNewForm)
    .post(isLoggedIn,  upload.single('listing[image][url]'), validateListing, WrapAsync(listingController.createListing));
    // .post(upload.single('listing[image][url]'), (req, res) => {res.send(req.file)});

router.route('/:id')
    .get(WrapAsync(listingController.showListing))
    .delete(isLoggedIn, isOwner, WrapAsync(listingController.deleteListing));

router.route('/:id/edit')
    .get(isLoggedIn, isOwner, WrapAsync(listingController.showEditListingPage))
    .put(isLoggedIn, isOwner, upload.single('listing[image][url]'), validateListing, WrapAsync(listingController.updateListing));


module.exports = router;