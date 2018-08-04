const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Tutor} = require('./../../models/tutors');
const {Review} = require('./../../models/reviews')

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const reviewId = [];
const reviewers = ['John', 'Sam', 'Steven', 'Stephanie', 'Jimmy', 'Billy']
const reviews = []
for(var i = 0; i < reviewers.length; i++){
    reviewId[i] = new ObjectID();
    reviews[i] = {
        reviewer: reviewers[i],
        text: "Lorem ipsum dolor sit amet, in vix ubique dissentiet adversarium. Vis alia brute et, vocent gloriatur ea per. Quo falli.",
        rating: Math.floor(Math.random()*5),
        _id: reviewId[i]
    }
}

const tutors = [
    {
        name: 'Daniel Bucci',
        email: 'email123@example.com',
        password: "password123",
        shortDescription: "Hi...",
        price: 50,
        showTutor: true,
        _id: userOneId,
        subjects: ['Calculus I', 'Waves and Optics'],
        reviews: reviewId
      },
      {
        name: 'Winkel Yin', 
        email: 'winkel123@example.com',
        password: "password123",
        shortDescription: "I am a Cal 2 tutor with an R-Score of 35",
        subjects: ['Calculus I', 'Calculus II'],
        price: 15,
        showTutor: true,
      },
      {
        name: 'Josh Lang', 
        email: 'sexyitalian517@example.com',
        password: "password123",
        shortDescription: "I am a Waves and Modern Physics tutor with an R-Score of 34",
        subjects: ['Calculus I', 'Calculus II', 'Waves and Optics'],
        price: 25,
        showTutor: true,
      },
      {
        name: 'William Chen', 
        email: 'singleasian6373@example.com',
        password: "password123",
        shortDescription: "I am Asian therefore I'm good at math",
        subjects: ['Calculus I', 'Mechanics'],
        price: 15,
        showTutor: true,
      },
      {
        name: 'Francesco Italiano',
        email: '55xXHotItalianXx55@example.com',
        password: "password123",
        shortDescription: "Hello, my name is Francesco and I love teaching!!!",
        subjects: ['Waves and Optics', 'Calculus III'],
        price: 5,
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
    }).then(() => seedTutor());

    function seedTutor(){
        Review.remove({}).then(() => {
            var savedReviews = [];
            for(var i = 0; i < reviews.length; i++){
                savedReviews.push(new Review(reviews[i]).save());
            }
            return Promise.all(savedReviews)
        }).then(() => done());
    }
}

module.exports = {tutors, populateTutor};