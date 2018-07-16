const request = require('supertest');
const expect = require('expect');
const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {app} = require('./../server');
const {Tutor} = require('./../models/tutors');
const {tutors, populateTutor} = require('./seed/seed');

beforeEach(populateTutor);

describe('GET /tutors', () => {
    it('should get all tutors', (done) => {
        request(app)
            .get('/tutors')
            .expect(200)
            .expect((res) => {
                expect(res.body.tutors.length).toBe(2);
            })
            .end(done);
    })
})

describe('GET /tutors/:id', () => {
    it('should get a tutor given an id', (done) => {
        request(app)
            .get(`/tutors/${tutors[0]._id}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.tutor.name).toBe(tutors[0].name);
            })
            .end(done);
    });

    it('should send 404 status if no tutor found', (done) => {
        request(app)
            .get(`/tutors/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done);
    })
})

describe('POST /tutors/signup', () => {

    const newTutor = {
        email: 'jesus12345@gmail.com',
        name: 'Jesus',
        password: 'godismydad'
    }

    it('should create a new tutor account with a token', (done) => {
        request(app)
            .post('/tutors/signup')
            .send(newTutor)
            .expect(201)
            .expect((res) => {
                expect(res.header['x-auth']).toBeTruthy();
            })
            .end((err) => {
                if(err){
                    return done(err);
                }

                Tutor.findOne({name: newTutor.name}).then((user) => { //Checking the database to see if tutor is saved properly
                    expect(user).toBeTruthy();
                    expect(user.password).not.toBe(newTutor.password); // To check if properly hashed
                    done();
                }).catch(e => done(e));
            });
    });
});

describe('PATCH /tutors/me', () => {
    const updateBody = { // This is what is sent as the body in the PATCH request
        shortDescription: "Testing short description",
        longDescription: "Testing loooooooooooonnnnnnnnnnnnnggggggggggggggggg description",
        price: 15
    }
    
    it('should edit given properties when tutor has valid auth token', (done) => {
        const token = tutors[0].tokens[0].token;

        request(app)
        .patch('/tutors/me')
        .set('x-auth', token)
        .send(updateBody)
        .expect(200)
        .expect((res) => {
            expect(res.body.tutor.shortDescription).toBe(updateBody.shortDescription);
            expect(res.body.tutor.longDescription).toBe(updateBody.longDescription);
            expect(res.body.tutor.price).toBe(updateBody.price);
        })
        .end(err => {
            if(err){
                return done(err);
            }

            Tutor.findByToken(token).then(tutor => {
                expect(tutor.shortDescription).toBe(updateBody.shortDescription);
                expect(tutor.longDescription).toBe(updateBody.longDescription);
                expect(tutor.price).toBe(updateBody.price);
                done();
            }).catch(e => done(e));
        })
    })

    it('should respond with 401 Unauthorized status and not modify properties when not authorized', (done) => {
        request(app)
        .patch('/tutors/me')
        .send(updateBody)
        .expect(401)
        .expect(res => {
            expect(res.body.status).toBe(401)
            expect(res.body.message).toBe('Unauthorized access');
        })
        .end(done);
    })
})

describe('POST /tutors/login', () => {
    it('should give tutor a token if credentials are valid', (done) => {
        const validCredentials = {
            email: tutors[0].email,
            name: tutors[0].name,
            password: tutors[0].password
        }

        request(app)
            .post('/tutors/login')
            .send(validCredentials)
            .expect(200)
            .expect(res => {
                expect(res.header['x-auth']).toBeTruthy();
            })
            .end(done);
    });

    it('should NOT give token if credentials are NOT VALID', (done) => {
        const invalidCredentials = {
            name: tutors[0].name,
            password: 'wrongpassword123'
        }

        request(app)
            .post('/tutors/login')
            .send(invalidCredentials)
            .expect(400)
            .expect(res => {
                expect(res.header['x-auth']).toBeFalsy();
            })
            .end(done);
    })
})