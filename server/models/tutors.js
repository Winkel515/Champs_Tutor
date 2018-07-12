const mongoose = require('mongoose');
const _ = require('lodash');

var TutorSchema = new mongoose.Schema({
    name: {
        required: true,
        trim: true,
        type: String,
        minlength: 1
    },
    password: {
        required: true,
        type: String,
        trim: true,
        minlength: 8
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
})

var Tutor = mongoose.model('Tutor', TutorSchema);

module.exports = {Tutor};