const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../app')
const mongoose = require('mongoose')
const expect = chai.expect

chai.use(chaiHttp)

// Drop database after test
after(function (done) {
    mongoose.connect(`mongodb://localhost/ecommerce`, { useNewUrlParser: true },
        function () {
            mongoose.connection.db.dropDatabase();
            done()
        })
});

// ========================================================================================================

// Sign Up (SUCCESS)
describe('POST /users/signUp', function () {
    it('should return status 201 with object of created user', function (done) {
        chai
            .request(app)
            .post('/users/signUp')
            .send({
                first_name: 'John',
                last_name: 'Doe',
                email: 'john@email.com',
                password: '12345'
            })
            .then((res) => {
                const { body } = res
                const { createdUser } = body
                expect(res).to.have.status(201)
                expect(body).to.be.an('object')
                expect(createdUser).to.have.property('first_name')
                expect(createdUser).to.have.property('last_name')
                expect(createdUser).to.have.property('email')
                expect(createdUser).to.have.property('password')
                done()
            })
            .catch((err) => {
                console.log(err)
            })
    })
})

// Sign Up (ERROR)
describe('POST /users/signUp', function () {
    // DUPLICATE EMAIL
    it('should return status 500 with object (ERROR: Email is already registered!)', function (done) {
        chai
            .request(app)
            .post('/users/signUp')
            .send({
                first_name: 'John',
                last_name: 'Doe',
                email: 'john@email.com',
                password: '12345'
            })
            .then((res) => {
                const { message } = res.body.errors.email
                const { body } = res
                expect(res).to.have.status(500)
                expect(body).to.be.an('object')
                expect(message).to.include('Email is already registered!')
                done()
            })
            .catch((err) => {
                console.log(err)
            })
    })

    // FIRST NAME EMPTY
    it('should return status 500 with object (ERROR: First name is required!)', function (done) {
        chai
            .request(app)
            .post('/users/signUp')
            .send({
                first_name: '',
                last_name: 'Doe',
                email: 'john@email.com',
                password: '12345'
            })
            .then((res) => {
                const { message } = res.body.errors.first_name
                const { body } = res
                expect(res).to.have.status(500)
                expect(body).to.be.an('object')
                expect(message).to.include('First name is required!')
                done()
            })
            .catch((err) => {
                console.log(err)
            })
    })

    // LAST NAME EMPTY
    it('should return status 500 with object (ERROR: Last name is required!)', function (done) {
        chai
            .request(app)
            .post('/users/signUp')
            .send({
                first_name: 'John',
                last_name: '',
                email: 'john@email.com',
                password: '12345'
            })
            .then((res) => {
                const { message } = res.body.errors.last_name
                const { body } = res
                expect(res).to.have.status(500)
                expect(body).to.be.an('object')
                expect(message).to.include('Last name is required!')
                done()
            })
            .catch((err) => {
                console.log(err)
            })
    })

    // EMAIL EMPTY
    it('should return status 500 with object (ERROR: Email is required!)', function (done) {
        chai
            .request(app)
            .post('/users/signUp')
            .send({
                first_name: 'John',
                last_name: 'Doe',
                email: '',
                password: '12345'
            })
            .then((res) => {
                const { message } = res.body.errors.email
                const { body } = res
                expect(res).to.have.status(500)
                expect(body).to.be.an('object')
                expect(message).to.include('Email is required!')
                done()
            })
            .catch((err) => {
                console.log(err)
            })
    })

    // PASSWORD EMPTY
    it('should return status 500 with object (ERROR: Password is required!)', function (done) {
        chai
            .request(app)
            .post('/users/signUp')
            .send({
                first_name: 'John',
                last_name: 'Doe',
                email: 'john@email.com',
                password: ''
            })
            .then((res) => {
                const { message } = res.body.errors.password
                const { body } = res
                expect(res).to.have.status(500)
                expect(body).to.be.an('object')
                expect(message).to.include('Password is required!')
                done()
            })
            .catch((err) => {
                console.log(err)
            })
    })
})

// ========================================================================================================

// Sign In (SUCCESS)
describe('POST /users/signIn', function () {
    it('should return status 200 with object of logged in user', function (done) {
        chai
            .request(app)
            .post('/users/signIn')
            .send({
                email: 'john@email.com',
                password: '12345'
            })
            .then((res) => {
                const { body } = res
                expect(res).to.have.status(200)
                expect(body).to.be.an('object')
                expect(body).to.have.property('token')
                expect(body).to.have.property('details')
                done()
            })
            .catch((err) => {
                console.log(err)
            })
    })
})

// Sign In (ERROR)
describe('POST /users/signIn', function () {
    // EMAIL EMPTY
    it('should return status 401 with object (ERROR: Email/Password is incorrect!)', function (done) {
        chai
            .request(app)
            .post('/users/signIn')
            .send({
                email: '',
                password: '12345'
            })
            .then((res) => {
                const { message } = res.body
                const { body } = res
                expect(res).to.have.status(401)
                expect(body).to.be.an('object')
                expect(message).to.include('Email/Password is incorrect!')
                done()
            })
            .catch((err) => {
                console.log(err)
            })
    })

    // PASSWORD EMPTY
    it('should return status 401 with object (ERROR: Email/Password is incorrect!)', function (done) {
        chai
            .request(app)
            .post('/users/signIn')
            .send({
                email: 'john@email.com',
                password: ''
            })
            .then((res) => {
                const { message } = res.body
                const { body } = res
                expect(res).to.have.status(401)
                expect(body).to.be.an('object')
                expect(message).to.include('Email/Password is incorrect!')
                done()
            })
            .catch((err) => {
                console.log(err)
            })
    })

    // WRONG PASSWORD
    it('should return status 401 with object (ERROR: Email/Password is incorrect!)', function (done) {
        chai
            .request(app)
            .post('/users/signIn')
            .send({
                email: 'john@email.com',
                password: '54321'
            })
            .then((res) => {
                const { message } = res.body
                const { body } = res
                expect(res).to.have.status(401)
                expect(body).to.be.an('object')
                expect(message).to.include('Email/Password is incorrect!')
                done()
            })
            .catch((err) => {
                console.log(err)
            })
    })
})

// ========================================================================================================