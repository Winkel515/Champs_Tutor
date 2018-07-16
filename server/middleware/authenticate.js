var {Tutor} = require('./../models/tutors');

//Error message JSON
const errorJSON = (status, message) => {return {status, message}};

var authenticate = (req, res, next) => {
    var token = req.header('x-auth');

    Tutor.findByToken(token).then((tutor) => {
        if(!tutor){
            console.log('No tutor found');
            return Promise.reject();
        }

        req.tutor = tutor;
        req.token = token;
        next();
    }).catch((e) => {
        res.status(401).send(errorJSON(401, 'Unauthorized access'));
    })
}

module.exports = {authenticate};