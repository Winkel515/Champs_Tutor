var {Tutor} = require('./../models/tutors');

//Error message JSON
const errorJSON = (status, message) => {return {status, message}};

var checkEmail = (req, res, next) => {
    console.log('header', req.header('email'));
    Tutor.findOne({email: req.header('email')}).then((tutor) => {
        if(tutor){
            return Promise.reject();
        }
        next();
    }).catch(() => {
        res.status(400).send(errorJSON(400, 'Email is already in use'));
    })
}

module.exports = {checkEmail};