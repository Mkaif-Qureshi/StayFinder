if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}
const express = require('express');
const app = express();
const port = 3001;
const mongoose = require('mongoose');
const path = require("path")
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const listingsRouter = require('./routes/listings.js');
const reviewsRouter = require('./routes/reviews.js');
const session  = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');
const userRouter = require('./routes/user.js');


const MONGO_URL = 'mongodb://127.0.0.1:27017/stayfinder'

app.set('view engine', "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
    secret : "mysupersecretcode",
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httOnly : true,
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize()); 
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

app.get('/demouser', async(req, res) =>{
    let fakeUser = new User({
        email : "stud1@gmail.com",
        username : "stud1",
    })

    let registeredUser = await User.register(fakeUser, "helloworld");
    res.send(registeredUser);
})


app.use('/listings', listingsRouter); 
app.use('/listings/:id/reviews', reviewsRouter);
app.use('/', userRouter);

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
