const initData = require('./data.js');
const mongoose = require('mongoose');
const Listing = require('../models/listing.js')

const MONGO_URL = 'mongodb://127.0.0.1:27017/stayfinder'

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

const initDB = async() => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((ele) => ({...ele, owner : '6650e1449b38016c26718295'}))
    await Listing.insertMany(initData.data);
    console.log("Data was initialized !")
}

initDB();
