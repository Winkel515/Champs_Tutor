const request = require('supertest');
const expect = require('expect');
const {ObjectID} = require('mongodb');

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

describe('POST /tutors', () => {

    const newTutor = {
        name: 'Jesus',
        password: 'godismydad'
    }

    it('should create a new tutor account with a token', (done) => {
        request(app)
            .post('/tutors')
            .send(newTutor)
            .expect(200)
            .expect((res) => {
                expect(res.body.name).toBe(newTutor.name);
                expect(res.header['x-auth']).toBeTruthy();
                expect(res.body._id).toBeTruthy();
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