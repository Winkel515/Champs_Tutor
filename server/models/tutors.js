const mongoose = require('mongoose');
const _ = require('lodash');

// Schema for tutors. Can add more such as description, ratings, etc.
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

// When sending tutor, display only name and id. Can change later
TutorSchema.methods.toJSON = function () {
    var tutor = this;
    var tutorObject = tutor.toObject();

    return _.pick(tutor, ['name', '_id']); // Paramaters in array are the ones that will be displayed
}

var Tutor = mongoose.model('Tutor', TutorSchema);

module.exports = {Tutor};