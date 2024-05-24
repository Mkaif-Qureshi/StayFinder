const express = require('express');
const app = express();
const port = 3001;
const mongoose = require('mongoose');
const path = require("path")
const Listing = require('./models/listing.js')
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');

const listings = require('./routes/listings.js');
const reviews = require('./routes/reviews.js');

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

app.use('/listings', listings); 
app.use('/listings/:id/reviews', reviews);

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
