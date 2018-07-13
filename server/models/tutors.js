const mongoose = require('mongoose');
const _ = require('lodash');
const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET;

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

TutorSchema.methods.generateAuthToken = function() {
    var tutor = this;
    var access = 'auth';
    var token = jwt.sign({_id: tutor._id.toHexString(), access}, secret);

    tutor.tokens.push({access, token});

    tutor.save();
    return token;
}

var Tutor = mongoose.model('Tutor', TutorSchema);

module.exports = {Tutor};