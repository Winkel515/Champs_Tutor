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