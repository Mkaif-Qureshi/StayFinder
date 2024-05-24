const mongoose = require('mongoose');
const review = require('./review');
const Schema = mongoose.Schema;

let listingSchema = new Schema({
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
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review"
        }
    ]
})

listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing){
        await review.deleteMany({_id: {$in : listing.reviews }})
    }
})

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;