const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../app')
const mongoose = require('mongoose')
const expect = chai.expect
const User = require('../models/user')
const { sign } = require('../helpers/jwt')
var ProductId = ''
var token = ''

chai.use(chaiHttp)

// Create Dummy Token
before(function (done) {
    User
        .create({
            first_name: 'Jane',
            last_name: 'Doe',
            email: process.env.ADMIN_EMAIL,
            password: '12345'
        })
        .then((createdUser) => {
            const { id, first_name, last_name, email, role } = createdUser
            const payload = { id, first_name, last_name, email, role }
            token = sign(payload)
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

// Create Product (SUCCESS)
describe('POST /products', function () {
    it('should return status 201 with object of created product', function (done) {
        chai
            .request(app)
            .post('/products')
            .send({
                name: 'Nike Mercurial',
                price: 1000000,
                stock: 10,
                image: 'https://c.static-nike.com/a/images/t_PDP_1280_v1/f_auto/mqexumyo2ml8nhui9rgl/mercurial-superfly-6-academy-mg-multi-ground-soccer-cleat-nBVALo.jpg'
            })
            .set({ token })
            .then((res) => {
                const { body } = res
                const { createdProduct } = body
                expect(res).to.have.status(201)
                expect(body).to.be.an('object')
                expect(createdProduct).to.have.property('name')
                expect(createdProduct).to.have.property('price')
                expect(createdProduct).to.have.property('stock')
                expect(createdProduct).to.have.property('image')
                ProductId = createdProduct._id
                done()
            })
            .catch((err) => {
                console.log(err)
            })
    })
})

// Create Product (ERROR)
describe('POST /products', function () {
    // FAILED AUTHENTICATION
    it('should return status 401 with object (ERROR: You do not have access to this page!)', function (done) {
        chai
            .request(app)
            .post('/products')
            .send({
                name: 'Nike Mercurial',
                price: 1000000,
                stock: 10,
                image: 'https://c.static-nike.com/a/images/t_PDP_1280_v1/f_auto/mqexumyo2ml8nhui9rgl/mercurial-superfly-6-academy-mg-multi-ground-soccer-cleat-nBVALo.jpg'
            })
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

    // NAME EMPTY
    it('should return status 500 with object (ERROR: Name is required!)', function (done) {
        chai
            .request(app)
            .post('/products')
            .send({
                name: '',
                price: 1000000,
                stock: 10,
                image: 'https://c.static-nike.com/a/images/t_PDP_1280_v1/f_auto/mqexumyo2ml8nhui9rgl/mercurial-superfly-6-academy-mg-multi-ground-soccer-cleat-nBVALo.jpg'
            })
            .set({ token })
            .then((res) => {
                const { message } = res.body.errors.name
                expect(res).to.have.status(500)
                expect(res).to.be.an('object')
                expect(message).to.include('Name is required!')
                done()
            })
            .catch((err) => {
                console.log(err)
            })
    })

    // PRICE EMPTY
    it('should return status 500 with object (ERROR: Price is required!)', function (done) {
        chai
            .request(app)
            .post('/products')
            .send({
                name: 'Nike Mercurial',
                price: '',
                stock: 10,
                image: 'https://c.static-nike.com/a/images/t_PDP_1280_v1/f_auto/mqexumyo2ml8nhui9rgl/mercurial-superfly-6-academy-mg-multi-ground-soccer-cleat-nBVALo.jpg'
            })
            .set({ token })
            .then((res) => {
                const { message } = res.body.errors.price
                expect(res).to.have.status(500)
                expect(res).to.be.an('object')
                expect(message).to.include('Price is required!')
                done()
            })
            .catch((err) => {
                console.log(err)
            })
    })

    // STOCK EMPTY
    it('should return status 500 with object (ERROR: Stock is required!)', function (done) {
        chai
            .request(app)
            .post('/products')
            .send({
                name: 'Nike Mercurial',
                price: 1000000,
                stock: '',
                image: 'https://c.static-nike.com/a/images/t_PDP_1280_v1/f_auto/mqexumyo2ml8nhui9rgl/mercurial-superfly-6-academy-mg-multi-ground-soccer-cleat-nBVALo.jpg'
            })
            .set({ token })
            .then((res) => {
                const { message } = res.body.errors.stock
                expect(res).to.have.status(500)
                expect(res).to.be.an('object')
                expect(message).to.include('Stock is required!')
                done()
            })
            .catch((err) => {
                console.log(err)
            })
    })

    // WHEN PRICE IS STRING
    it('should return status 500 with object (ERROR: Invalid Price)', function (done) {
        chai
            .request(app)
            .post('/products')
            .send({
                name: 'Nike Mercurial',
                price: 'Invalid Price',
                stock: 10,
                image: 'https://c.static-nike.com/a/images/t_PDP_1280_v1/f_auto/mqexumyo2ml8nhui9rgl/mercurial-superfly-6-academy-mg-multi-ground-soccer-cleat-nBVALo.jpg'
            })
            .set({ token })
            .then((res) => {
                const { value } = res.body.errors.price
                expect(res).to.have.status(500)
                expect(res).to.be.an('object')
                expect(value).to.include('Invalid Price')
                done()
            })
            .catch((err) => {
                console.log(err)
            })
    })

    // PRICE < 0
    it('should return status 500 with object (ERROR: Invalid Price)', function (done) {
        chai
            .request(app)
            .post('/products')
            .send({
                name: 'Nike Mercurial',
                price: -1000000,
                stock: 10,
                image: 'https://c.static-nike.com/a/images/t_PDP_1280_v1/f_auto/mqexumyo2ml8nhui9rgl/mercurial-superfly-6-academy-mg-multi-ground-soccer-cleat-nBVALo.jpg'
            })
            .set({ token })
            .then((res) => {
                const { message } = res.body.errors.price
                expect(res).to.have.status(500)
                expect(res).to.be.an('object')
                expect(message).to.include('Invalid Price')
                done()
            })
            .catch((err) => {
                console.log(err)
            })
    })

    // WHEN STOCK IS STRING
    it('should return status 500 with object (ERROR: Invalid Stock)', function (done) {
        chai
            .request(app)
            .post('/products')
            .send({
                name: 'Nike Mercurial',
                price: 1000000,
                stock: 'Invalid Stock',
                image: 'https://c.static-nike.com/a/images/t_PDP_1280_v1/f_auto/mqexumyo2ml8nhui9rgl/mercurial-superfly-6-academy-mg-multi-ground-soccer-cleat-nBVALo.jpg'
            })
            .set({ token })
            .then((res) => {
                const { value } = res.body.errors.stock
                expect(res).to.have.status(500)
                expect(res).to.be.an('object')
                expect(value).to.include('Invalid Stock')
                done()
            })
            .catch((err) => {
                console.log(err)
            })
    })

    // STOCK < 0
    it('should return status 500 with object (ERROR: Invalid Stock)', function (done) {
        chai
            .request(app)
            .post('/products')
            .send({
                name: 'Nike Mercurial',
                price: 1000000,
                stock: -10,
                image: 'https://c.static-nike.com/a/images/t_PDP_1280_v1/f_auto/mqexumyo2ml8nhui9rgl/mercurial-superfly-6-academy-mg-multi-ground-soccer-cleat-nBVALo.jpg'
            })
            .set({ token })
            .then((res) => {
                const { message } = res.body.errors.stock
                expect(res).to.have.status(500)
                expect(res).to.be.an('object')
                expect(message).to.include('Invalid Stock')
                done()
            })
            .catch((err) => {
                console.log(err)
            })
    })
})

// ========================================================================================================

// Get Products (SUCCESS)
describe('GET /products', function () {
    it('should return status 200 with array of products', function (done) {
        chai
            .request(app)
            .get('/products')
            .set({ token })
            .then((res) => {
                const { body } = res
                expect(res).to.have.status(200)
                expect(body).to.be.an('array')
                done()
            })
            .catch((err) => {
                console.log(err)
            })
    })
})

// Get Products (ERROR)
describe('GET /products', function () {
    // FAILED AUTHENTICATION
    it('should return status 401 with object (ERROR: You do not have access to this page!)', function (done) {
        chai
            .request(app)
            .get('/products')
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

// Update Product (SUCCESS)
describe('PUT /products/:ProductId', function () {
    it('should return status 200 with object of updated product', function (done) {
        chai
            .request(app)
            .patch(`/products/${ProductId}`)
            .send({
                name: 'Nike Tiempo',
                price: 800000,
                stock: 5,
                image: 'https://c.static-nike.com/a/images/t_PDP_1280_v1/f_auto/gv1bbj7fqjsnuyhsvsqf/tiempo-legend-vii-pro-football-boot-JxKP2L.jpg'
            })
            .set({ token })
            .then((res) => {
                const { body } = res
                const { updatedProduct } = body
                expect(res).to.have.status(200)
                expect(body).to.be.an('object')
                expect(updatedProduct).to.have.property('name')
                expect(updatedProduct).to.have.property('price')
                expect(updatedProduct).to.have.property('stock')
                expect(updatedProduct).to.have.property('image')
                done()
            })
            .catch((err) => {
                console.log(err)
            })
    })
})

// Update Product (ERROR)
describe('PUT /products/:ProductId', function () {
    // FAILED AUTHENTICATION
    it('should return status 401 with object (ERROR: You do not have access to this page!)', function (done) {
        chai
            .request(app)
            .patch(`/products/${ProductId}`)
            .send({
                name: 'Nike Tiempo',
                price: 800000,
                stock: 5,
                image: 'https://c.static-nike.com/a/images/t_PDP_1280_v1/f_auto/gv1bbj7fqjsnuyhsvsqf/tiempo-legend-vii-pro-football-boot-JxKP2L.jpg'
            })
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

// Delete Product (SUCCESS)
describe('DELETE /products/:ProductId', function () {
    it('should return status 200 with object of deleted product', function (done) {
        chai
            .request(app)
            .delete(`/products/${ProductId}`)
            .set({ token })
            .then((res) => {
                const { body } = res
                const { message } = body
                expect(res).to.have.status(200)
                expect(body).to.be.an('object')
                expect(message).to.include('Deleted a product!')
                done()
            })
            .catch((err) => {
                console.log(err)
            })
    })
})

// Delete Product (ERROR)
describe('DELETE /products/:ProductId', function () {
    it('should return status 401 with object (ERROR: You do not have access to this page!)', function (done) {
        chai
            .request(app)
            .delete(`/products/${ProductId}`)
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