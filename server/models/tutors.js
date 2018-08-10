const mongoose = require('mongoose');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const secret = process.env.JWT_SECRET;

// Schema for tutors. Can add more such as description, ratings, etc.
var TutorSchema = new mongoose.Schema({
    email: {
        required: true,
        trim: true,
        type: String,
        unique: true,
        minlength: 1,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
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
    price: {
        type: Number,
        min: 0,
        default: 0
    },
    description: { // Tutor can make a short description of themselves which will be visible on the main page
        type: String,
        maxlength: 250,
        required: true,
        trim: true
    },
    showTutor: {
        type: Boolean,
        default: true
    },
    program: { // Stores tutor's field of study (e.g. Pure & Applied)
        // Should have to validate if program
    },
    subjects: {
        type: Array,
        of: String,
        default: []
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],
    rating: {
        type: Number,
        max: 5,
        min: 0,
        default: 0,
        required:true
    }
    // tokens: [{
    //     access: {
    //         type: String,
    //         required: true
    //     },
    //     token: {
    //         type: String,
    //         required: true
    //     }
    // }]
})

TutorSchema.methods.generateAuthToken = function() { // Generated token gets saved in the databased. Can be problematic as it adds up. Could solved by deleting on closing app.
    var tutor = this;
    var token = jwt.sign({_id: tutor._id.toHexString(), name: tutor.name}, secret);

    // tutor.tokens.push({access, token}); // Gets pushed in the tutor object...
    // tutor.save(); // Then it gets saved. Might want to change that!

    return token;
}

TutorSchema.methods.verifyTutor = function (password) { // Checks if input password is valid
    const tutor = this;

    return new Promise((resolve, reject) => {
        bcrypt.compare(password, tutor.password, (err, res) => {
            if(res){
                resolve();
            } else {
                reject({
                    message: "Wrong password"
                });
            }
        });
    });
}

TutorSchema.statics.findByToken = function (token) {
    const Tutor = this;
    var decoded;
    try{
        decoded = jwt.verify(token, secret);
    } catch(e){
        return Promise.reject();
    }

    return Tutor.findOne({
        _id: decoded._id
    });
}

TutorSchema.statics.findByCredentials = function(email, password) {
    return Tutor.findOne({email}).then(tutor => {
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