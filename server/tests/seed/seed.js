const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Tutor} = require('./../../models/tutors');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const tutors = [{
    _id: userOneId,
    email: 'winky@hotmail.com',
    name: 'Winkel',
    password: 'winkel123',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId.toHexString(), access: 'auth'}, process.env.JWT_SECRET)
    }]
}, {
    _id: userTwoId,
    email: 'daniel@gmail.com',
    name: 'Daniel',
    password: 'daniel123',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userTwoId.toHexString(), access: 'auth'}, process.env.JWT_SECRET)
    }]
}]

const populateTutor = (done) => {
    Tutor.remove({}).then(() => {
        var userOne = new Tutor(tutors[0]).save();
        var userTwo = new Tutor(tutors[1]).save();
        return Promise.all([userOne, userTwo]);
    }).then(() => done());
}

module.exports = {tutors, populateTutor};