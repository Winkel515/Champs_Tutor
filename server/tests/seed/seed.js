const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Tutor} = require('./../../models/tutors');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const tutors = [
    {
        name: 'Daniel Bucci',
        email: 'email123@example.com',
        password: "password123",
        shortDescription: "Hi...",
        price: 10,
        showTutor: true,
        _id: userOneId,
        subjects: ['Waves and Optics'],
        tokens: [{
            access: 'auth',
            token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET)
        }]
      },
      {
        name: 'Winkel Yin', 
        email: 'winkel123@example.com',
        password: "password123",
        shortDescription: "I am a Cal 2 tutor with an R-Score of 35",
        subjects: ['Calculus I'],
        price: 15,
        showTutor: true,
      },
      {
        name: 'Josh Lang', 
        email: 'sexyitalian517@example.com',
        password: "password123",
        shortDescription: "I am a Waves and Modern Physics tutor with an R-Score of 34",
        subjects: ['Waves and Optics'],
        price: 50,
        showTutor: true,
      },
      {
        name: 'William Chen', 
        email: 'singleasian6373@example.com',
        password: "password123",
        shortDescription: "I am Asian therefore I'm good at math",
        subjects: ['Calculus I'],
        price: 15,
        showTutor: true,
      },
      {
        name: 'Francesco Italiano',
        email: '55xXHotItalianXx55@example.com',
        password: "password123",
        shortDescription: "Hello, my name is Francesco and I love teaching!!!",
        subjects: ['Waves and Optics'],
        price: 20,
        showTutor: true,
      },
];

const populateTutor = (done) => {
    Tutor.remove({}).then(() => {
        var savedTutors = [];
        for(var i = 0; i < tutors.length; i++){
            savedTutors.push(new Tutor(tutors[i]).save());
        }
        return Promise.all(savedTutors);
    }).then(() => done());
}

module.exports = {tutors, populateTutor};