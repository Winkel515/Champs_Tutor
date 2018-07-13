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

app.get('/tutors', (req, res) => {
    Tutor.find().then((tutors) => {
        res.send({tutors});
    }).catch((e) => {
        res.status(400).send();
    });
});

app.listen(port, () => {
    console.log(`Server open on port ${port}`);
});

module.exports = {app};