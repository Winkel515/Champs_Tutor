const mongoose = require('mongoose');

ReviewSchema = new mongoose.Schema({
    reviewer: {
        type: String,
        minlength: 1,
        required: true,
        trim: true
    },
    tutorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    text: {
        type: String,
        maxlength: 250,
        trim: true,
        default: ""
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    },
    date: {
        type: Number,
        required: true,
        default: new Date().getTime()
    }
})

var Review = mongoose.model("Review", ReviewSchema);

module.exports = {Review};