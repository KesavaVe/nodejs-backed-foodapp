const mongoose = require("mongoose");

const Foodinfo = new mongoose.Schema({
    name : {
        type : String,
        required: true
    },   
    category : {
        type : String,
        required : true
    },
    description :{
        type : String,
        required : true
    },
    integrates : {
        type : [String],
        required : true
    }
})

module.exports = mongoose.model('Fooditems', Foodinfo)