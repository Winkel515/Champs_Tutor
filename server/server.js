require('./config/config')

const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require ('lodash');

const {Tutor} = require('./models/tutors');
const {mongoose} = require('./db/mongoose');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Process GET /tutors request and responds with an array of tutors objects
app.get('/tutors', (req, res) => {
    Tutor.find().then((tutors) => {
        res.send({tutors});
    }).catch((e) => {
        res.status(400).send();
    });
});

// Process GET /tutors/:id request and responds with a single tutor's name and _id
app.get('/tutors/:id', (req, res) => {
    var id = req.params.id;

    if(!ObjectID.isValid(id)) {
        return res.status(400).send();
    }
    
    Tutor.findOne({
        _id: id
    }).then((tutor) => {
        if(!tutor){
            return res.status(404).send();
        }
        res.send({tutor});
    })
})

// Process POST /tutors requests and responds with the tutor's name and _id. Also gives the tutor a JSON web token.
app.post('/tutors', (req, res) => {
    var body = _.pick(req.body, ['name', 'password']) // On sign-up, tutors will input name and password. Can add email support if needed
    var tutor = new Tutor(body);

    tutor.save().then(() => {
        return tutor.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(tutor);
    }).catch((e) => {
        res.status(400).send(e);
    })
})

app.listen(port, () => {
    console.log(`Server open on port ${port}`);
});

module.exports = {app};