const mongoose = require('mongoose');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    price: {
        type: Number,
        min: 0,
        default: 0
    },
    shortDescription: { // Tutor can make a short description of themselves which will be visible on the main page
        type: String,
        maxlength: 100,
        default: '',
        trim: true
    },
    longDescription: {
        type: String,
        maxlength: 500,
        default: '',
        trim: true
    },
    program: { // Stores tutor's field of study (e.g. Pure & Applied)
        // Should have to validate if program
    },
    subjects: {
        type: Array,
        of: String,
        default: []
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

TutorSchema.methods.generateAuthToken = function() { // Generated token gets saved in the databased. Can be problematic as it adds up. Could solved by deleting on closing app.
    var tutor = this;
    var access = 'auth';
    var token = jwt.sign({_id: tutor._id.toHexString(), access}, secret);

    tutor.tokens.push({access, token}); // Gets pushed in the tutor object...
    tutor.save(); // Then it gets saved. Might want to change that!

    return token;
}

TutorSchema.statics.findByToken = function (token) {
    const Tutor = this;
    var decoded;
    try{
        decoded = jwt.verify(token, secret);
    } catch(e){
        console.log('Error in decoding JWT. Probably invalid secret');
        return Promise.reject();
    }

    return Tutor.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
}

TutorSchema.statics.findByCredentials = function(name, password) {
    return Tutor.findOne({name}).then(tutor => {
        if(!tutor) {
            return Promise.reject();
        }

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, tutor.password, (err, res) => {
                if(res){
                    resolve(tutor);
                } else {
                    reject();
                }
            })
        })
    })
}

TutorSchema.pre('save', function(next) { // Every time a tutor's profile is saved, check if the password was modified
    const tutor = this;
    if(tutor.isModified('password')) { // If modified, generate a new hashed password
        bcrypt.genSalt(12, (err, salt) => {
            bcrypt.hash(tutor.password, salt, (err, hash) => {
                tutor.password = hash;
                next();
            })
        })
    } else { // Else do nothing
        next();
    }
})

var Tutor = mongoose.model('Tutor', TutorSchema);

module.exports = {Tutor};