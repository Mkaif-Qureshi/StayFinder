const express = require('express');
const app = express();
const port = 3001;
const mongoose = require('mongoose');
const path = require("path")
const Listing = require('./models/listing.js')
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');

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

app.listen(port, ()=>{
    console.log(`App listening on ${port}`);
})

app.get('/', (req, res) => {
    res.redirect('/listings')
})

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
app.get('/listings', async (req, res) => {
    let listings = await Listing.find({})
    // console.log(listings);
    res.render("./listings/index.ejs", { listings });
})

// new route
app.get('/listings/new', (req, res) => {
    res.render("./listings/new.ejs");
})

app.post('/listings/new', (req, res) => {
    const newListing = new Listing(req.body.listing);
    console.log(newListing);
    newListing.save();
    res.redirect('/listings');
})

//show route
app.get('/listings/:id', async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id)
    console.log(listing);
    res.render("./listings/show.ejs", { listing });
})

//edit route
app.get('/listings/:id/edit', async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    console.log(listing)
    res.render('./listings/edit.ejs', { listing })
})

//update route
app.put('/listings/:id/edit', async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`)
})

//delete route 
app.delete('/listings/:id', async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing)
    res.redirect("/listings");
})

