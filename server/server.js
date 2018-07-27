require('./config/config')

const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require ('lodash');
const path = require('path');

const {Tutor} = require('./models/tutors');
const {mongoose} = require('./db/mongoose');
const publicPath = path.join(__dirname, '../public');
const {authenticate} = require('./middleware/authenticate')

var app = express();
const port = process.env.PORT || 3000;

//Error message JSON
const errorJSON = (status, message) => {return {status, message}};

//List of tutor properties shared in both MAIN and PROFILE page
const sharedProperties = 'name _id rating price subjects '; // Edit shared properties here

app.use(bodyParser.json());
app.use(express.static(publicPath));

// Process GET /tutors request and responds with an array of tutors objects
app.get('/tutors', (req, res) => {
    const mainProperties = 'shortDescription';

    Tutor.find({}, `${sharedProperties + mainProperties}`).then((tutors) => {
        res.json({tutors});
    }).catch((e) => {
        res.status(404).json(errorJSON(404, 'Could not connect to the database'));
    });
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname + '/../public/signUp.html'));
});

app.get('/:id', (req, res) => {
    Tutor.findById(req.params.id).then((tutor) => {
        if(!tutor){
            return Promise.reject();
        }
        res.sendFile(path.join(__dirname + '/../public/tutor.html'));
    }).catch(e => {
        res.send(`Could not find ${req.params.id}`);
    })
});

// Process GET /tutors/:id request and responds with a single tutor's name and _id
app.get('/tutors/:id', (req, res) => {
    const profileProperties = 'longDescription email';
    var id = req.params.id;

    if(!ObjectID.isValid(id)) {
        return res.status(400).json(errorJSON(400, 'ID is invalid'));
    }
    
    Tutor.findOne({
        _id: id
    }, `${sharedProperties + profileProperties}`).then((tutor) => {
        if(!tutor){
            return res.status(404).json(errorJSON(404, 'Tutor was not found'));
        }
        res.send({tutor});
    }).catch(e => res.status(400).json(errorJSON(400, 'Error')));
})

// Process POST /tutors/signup requests and responds with the tutor's name and _id. Also gives the tutor a JSON web token.
app.post('/tutors/signup', (req, res) => {
    var body = _.pick(req.body, ['email', 'name', 'password', 'credentials', 'availabilities', 'subjects']) // On sign-up, tutors will input email, name and password.
    var tutor = new Tutor(body);

    tutor.save().then(() => {
        return tutor.generateAuthToken();
    }).then((token) => {
        res.status(201).header('x-auth', token).send(); // Sending back nothing in response body
    }).catch((e) => {
        if(e.message === `E11000 duplicate key error collection: TutorMeTest.tutors index: email_1 dup key: { : "${body.email}" }`){
            e.message = 'Email is already in use';
        }
        res.status(400).send(errorJSON(400, e.message));
    })
});

// Route to allow tutors to edit their profile
app.patch('/tutors/me', authenticate, (req, res) => {
    const editList = ['oldPassword','password', 'price', 'subjects', 'shortDescription', 'longDescription', 'showTutor']; // Array to store properies that can be edited by the tutor
    const body = _.pick(req.body, editList);

    if(!body.password){
        Tutor.findOneAndUpdate({
            _id: req.tutor._id
        }, {$set: body}, {new: true},).then(tutor => {
            res.send();
        }).catch((e) => {
            res.status(400).send(errorJSON(400, 'Tutor was not found'));
        })
    } else{
        Tutor.findOne({_id: req.tutor._id}).then(tutor => {
            tutor.verifyTutor(body.oldPassword).then(() => {
                for(let key in body){
                    tutor[key] = body[key];
                }
                tutor.save().then(() => {
                    res.send();
                })
            }).catch(e => {
                res.status(400).send(errorJSON(400, 'Incorrect password'));
            })
        }).catch((e) => {
            res.status(400).send(errorJSON(400, 'Tutor was not found'));
        })
    }
})

app.delete('/tutors/me', authenticate, (req, res) => {
    const body = _.pick(req.body, ['password']);

    Tutor.findOne({_id: req.tutor._id}).then(tutor => {
        tutor.verifyTutor(body.password).then(() => {
            Tutor.deleteOne({_id: req.tutor._id}).then(() => {
                res.status(200).send();
            }).catch(e => {
                res.status(400).send(errorJSON(400, 'Unexpected error'));
            })
        }).catch(e => {
            res.status(400).send(errorJSON(400, 'Incorrect Password'));
        })
    }).catch(e => {
        res.status(401).send(errorJSON(401, 'Unauthorized access'));
    })
});

// ******************************** URGENT MUST FIX MUST FIX BELOW!!! *********************************************

// Process POST /tutors/login. Takes in name and password (might have to add email to be unique) and sends back a token on 'x-auth' header property. Response body will be empty (Unless front-end needs it)
app.post('/tutors/login', (req, res) => { // URGENT MUST FIX: will create second token in database
    const loginCredentials = ['email', 'password'];
    var body = _.pick(req.body, loginCredentials);

    Tutor.findByCredentials(body.email, body.password).then(tutor => {
        res.header('x-auth', tutor.generateAuthToken()).send(); //Not sending any response body
    }).catch(e => {
        res.status(400).send(errorJSON(400, 'Invalid login credentials'));
    })
});

// ******************************* URGENT STOPS HERE :P *************************************

app.listen(port, () => {
    console.log(`Server open on port ${port}`);
});

module.exports = {app};