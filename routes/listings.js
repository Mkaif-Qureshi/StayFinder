const express = require('express');
const router = express.Router();
const ExpressError = require('../utils/ExpressError.js');
const WrapAsync = require('../utils/WrapAsync.js');
const {listingSchema} = require('../schema.js')
const Listing = require('../models/listing.js')
const {isLoggedIn} = require('../middleware.js');

const validateListing = (err, req, res, next) => {
    let {error} = listingSchema.validate(req.body)
    // console.log(result);

    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, error);
    }else{
        next();
    }
}

//index route
router.get('/', WrapAsync(async (req, res) => {
    let listings = await Listing.find({})
    // console.log(listings);
    res.render("./listings/index.ejs", { listings });
}))

// new route
router.get('/new',isLoggedIn, (req, res) => {
    res.render("./listings/new.ejs");
})

//craete route
router.post('/new', isLoggedIn, validateListing, WrapAsync(async (req, res, err) => {
        const newListing = new Listing(req.body.listing);
        // console.log(newListing);
        await newListing.save();
        req.flash("success", "New Listing Created!");
        res.redirect('/listings');
    })
);

//show route
router.get('/:id', WrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews")
    // console.log(listing.reviews);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect('/listings');
    }
    res.render("./listings/show.ejs", { listing });
}))

//edit route
router.get('/:id/edit', isLoggedIn, WrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    // console.log(listing)
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect('/listings');
    }
    res.render('./listings/edit.ejs', { listing })
}))

//update route
router.put('/:id/edit', isLoggedIn, validateListing, WrapAsync(async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Edited successfully !");
    res.redirect(`/listings/${id}`)
}))

//delete route 
router.delete('/:id', isLoggedIn, WrapAsync(async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    // console.log(deletedListing)
    req.flash("success", "Listing deleted Successfully!");
    res.redirect("/listings");
}))


module.exports = router;