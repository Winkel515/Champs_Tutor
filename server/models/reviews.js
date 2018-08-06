const mongoose = require('mongoose');

ReviewSchema = new mongoose.Schema({
    reviewer: {
        type: String,
        minlength: 1,
        required: true,
        trim: true
    },
    text: {
        type: String,
        maxlength: 200,
        trim: true,
        default: ""
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    }
}, {
    timestamps: {}
})

var Review = mongoose.model("Review", ReviewSchema);

module.exports = {Review};