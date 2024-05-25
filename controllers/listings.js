const Listing = require('../models/listing.js');

module.exports.index = async (req, res) => {
    let listings = await Listing.find({})
    // console.log(listings);
    res.render("./listings/index.ejs", { listings });
}

module.exports.renderNewForm = (req, res) => {
    res.render("./listings/new.ejs");
}

module.exports.createListing = async (req, res, err) => {
    const newListing = new Listing(req.body.listing);
    // console.log(newListing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect('/listings');
}

module.exports.showListing = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path : "reviews", populate : { path : "author",}}).populate("owner")
    // console.log(listing.reviews);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect('/listings');
    }
    res.render("./listings/show.ejs", { listing });
}


module.exports.showEditListingPage = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    // console.log(listing)
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect('/listings');
    }
    res.render('./listings/edit.ejs', { listing })
}

module.exports.updateListing = async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Edited successfully !");
    res.redirect(`/listings/${id}`)
}

module.exports.deleteListing = async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    // console.log(deletedListing)
    req.flash("success", "Listing deleted Successfully!");
    res.redirect("/listings");
}