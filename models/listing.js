const mongoose = require('mongoose');
const schema = mongoose.Schema;
let listingSchema = new schema({
    title :{
        type: String,
        required : true
    },
    description :{
        type: String,
    },
    image : Object,
    price :{
        type: Number,
    },
    location :{
        type: String,
    },
    country :{
        type: String,
    },
})

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;