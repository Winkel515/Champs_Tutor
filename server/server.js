require('./config/config')

const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require ('lodash');
const path = require('path');

const {Tutor} = require('./models/tutors');
const {mongoose} = require('./db/mongoose');
const publicPath = path.join(__dirname, '../public');

var app = express();
const port = process.env.PORT || 3000;

//Error message JSON
const errorJSON = (status, message) => {
    return {
        status,
        message
    }
}

app.use(bodyParser.json());
app.use(express.static(publicPath));

// Process GET /tutors request and responds with an array of tutors objects
app.get('/tutors', (req, res) => {
    Tutor.find().then((tutors) => {
        tutors = tutors.map(tutor => tutor.toJSONMain());
        res.json({tutors});
    }).catch((e) => {
        res.status(404).json(errorJSON(404, 'Could not connect to the database'));
    });
});

// Process GET /tutors/:id request and responds with a single tutor's name and _id
app.get('/tutors/:id', (req, res) => {
    var id = req.params.id;

    if(!ObjectID.isValid(id)) {
        return res.status(400).json(errorJSON(400, 'ID is invalid'));
    }
    
    Tutor.findOne({
        _id: id
    }).then((tutor) => {
        if(!tutor){
            return res.status(404).json(errorJSON(404, 'Tutor was not found'));
        }
        tutor = tutor.toJSONProfile();
        res.send({tutor});
    }).catch(e => res.status(400).json(errorJSON(400, 'Error')));
})

// Process POST /tutors requests and responds with the tutor's name and _id. Also gives the tutor a JSON web token.
app.post('/tutors/signup', (req, res) => {
    var body = _.pick(req.body, ['name', 'password']) // On sign-up, tutors will input name and password. Can add email support if needed
    var tutor = new Tutor(body);

    tutor.save().then(() => {
        return tutor.generateAuthToken();
    }).then((token) => {
        tutor = tutor.toJSONProfile();
        res.header('x-auth', token).send({tutor});
    }).catch((e) => {
        res.status(400).send(errorJSON(400, e.message));
    })
})

app.listen(port, () => {
    console.log(`Server open on port ${port}`);
});

module.exports = {app};