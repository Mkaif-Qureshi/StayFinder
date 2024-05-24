const express = require('express');
const app = express();
const port = 3001;
const mongoose = require('mongoose');
const path = require("path")
const Listing = require('./models/listing.js')
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/WrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');
const WrapAsync = require('./utils/WrapAsync.js');
const {listingSchema} = require('./schema.js')
const Review = require('./models/review.js');
const {reviewSchema} = require('./schema.js')

const MONGO_URL = 'mongodb://127.0.0.1:27017/stayfinder'

app.set('view engine', "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")))

main()
.then(() => {
    console.log("Mongoose connected Successfully :)")
})
.catch((err) => {
    console.log(err);
})



async function main(){
    await mongoose.connect(MONGO_URL);
}

app.get('/', (req, res) => {
    res.redirect('/listings')
})

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

// app.get('/testListing', (req, res) => {
//     let listing1 = new Listing({
//         title : "My Villa",
//         description : "near the beach",
//         price: 19200,
//         location : "Bandra, Mumbai",
//         country: "India"
//     })

//     listing1.save()
//     .then(() => {
//         console.log('success');
//     })
//     .catch((err) => {
//         console.log(err);
//     })
// })


//index route
app.get('/listings', WrapAsync(async (req, res) => {
    let listings = await Listing.find({})
    // console.log(listings);
    res.render("./listings/index.ejs", { listings });
}))

// new route
app.get('/listings/new', (req, res) => {
    res.render("./listings/new.ejs");
})

//craete route
app.post('/listings/new', validateListing, wrapAsync(async (req, res, err) => {
        const newListing = new Listing(req.body.listing);
        // console.log(newListing);
        await newListing.save();
        res.redirect('/listings');
    })
);

//show route
app.get('/listings/:id', WrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews")
    // console.log(listing.reviews);
    res.render("./listings/show.ejs", { listing });
}))

//edit route
app.get('/listings/:id/edit', WrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    // console.log(listing)
    res.render('./listings/edit.ejs', { listing })
}))

//update route
app.put('/listings/:id/edit', validateListing, WrapAsync(async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`)
}))

//delete route 
app.delete('/listings/:id', WrapAsync(async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    // console.log(deletedListing)
    res.redirect("/listings");
}))

//Reviews
//Post review route
app.post('/listings/:id/review', validateReview, wrapAsync(async(req, res) => {
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
app.delete('/listings/:id/reviews/:reviewId', async(req, res) => {
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull : { reviews : reviewId }})
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
})


app.all('*', (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
})

app.use((err, req, res, next) => {
    let {status= 500 , message = "Some Erro"} = err;
    // res.status(status).send(message)
    res.status(status).render('error', {err})
})

app.listen(port, ()=>{
    console.log(`App listening on ${port}`);
})
