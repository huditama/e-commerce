const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../app')
const mongoose = require('mongoose')
const expect = chai.expect
const User = require('../models/user')
const Product = require('../models/product')
const { sign } = require('../helpers/jwt')
var UserId = ''
var ProductId = ''
var token = ''

chai.use(chaiHttp)

// Create Dummy Token & Dummy Product
before(function (done) {
    User
        .create({
            first_name: 'Jade',
            last_name: 'Doe',
            email: 'jade@email.com',
            password: '12345'
        })
        .then((createdUser) => {
            const { id, first_name, last_name, email } = createdUser
            const payload = { id, first_name, last_name, email }
            UserId = id
            token = sign(payload)
            return Product.create({
                name: 'Nike CTR360',
                price: 2000000,
                image: 'https://i.ebayimg.com/images/g/TcAAAOSwBv9Z4Nwz/s-l300.jpg',
                stock: 10
            })
        })
        .then((createdProduct) => {
            const { id } = createdProduct
            ProductId = id
            done()
        })
        .catch((err) => {
            console.log(err)
        })
})

// Drop database after testing
after(function (done) {
    mongoose.connect(`mongodb://localhost/ecommerce`, { useNewUrlParser: true },
        function () {
            mongoose.connection.db.dropDatabase();
            done()
        })
});

// ========================================================================================================

// Create Cart (SUCCESS)
describe('POST /carts', function () {
    it('should return status 201 with object of created card', function (done) {
        chai
            .request(app)
            .post('/carts')
            .send({ UserId, ProductId })
            .set({ token })
            .then((res) => {
                const { body } = res
                const { createdCart } = body
                const { products } = createdCart
                expect(res).to.have.status(201)
                expect(body).to.be.an('object')
                expect(products).to.be.an('array')
                CartId = createdCart._id
                done()
            })
            .catch((err) => {
                console.log(err)
            })
    })
})

// Create Cart (ERROR)
describe('POST /carts', function () {
    it('should return status 401 with object (ERROR: You do not have access to this page!)', function (done) {
        chai
            .request(app)
            .post('/carts')
            .send({ UserId, ProductId })
            .set({ token: '' })
            .then((res) => {
                const { body } = res
                const { type, message } = body
                expect(res).to.have.status(401)
                expect(body).to.be.an('object')
                expect(type).to.include('AUTHENTICATION ERROR')
                expect(message).to.include('You do not have access to this page!')
                done()
            })
            .catch((err) => {
                console.log(err)
            })
    })
})

// ========================================================================================================

// Delete Cart (SUCCESS)
describe('DELETE /carts/:CartId', function () {
    it('should return status 200 with object of deleted cart', function (done) {
        chai
            .request(app)
            .delete(`/carts/${CartId}`)
            .set({ token })
            .then((res) => {
                const { body } = res
                const { message } = body
                expect(res).to.have.status(200)
                expect(body).to.be.an('object')
                expect(message).to.include('Deleted cart!')
                done()
            })
            .catch((err) => {
                console.log(err)
            })
    })
})

// Delete Cart (ERROR)
describe('DELETE /carts/:CartId', function () {
    it('should return status 401 with object (ERROR: You do not have access to this page!)', function (done) {
        chai
            .request(app)
            .delete(`/carts/${CartId}`)
            .set({ token: '' })
            .then((res) => {
                const { body } = res
                const { type, message } = body
                expect(res).to.have.status(401)
                expect(body).to.be.an('object')
                expect(type).to.include('AUTHENTICATION ERROR')
                expect(message).to.include('You do not have access to this page!')
                done()
            })
            .catch((err) => {
                console.log(err)
            })
    })
})

// ========================================================================================================
