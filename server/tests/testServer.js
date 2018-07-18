const request = require('supertest');
const expect = require('expect');
const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {app} = require('./../server');
const {Tutor} = require('./../models/tutors');
const {tutors, populateTutor} = require('./seed/seed');

beforeEach(populateTutor);