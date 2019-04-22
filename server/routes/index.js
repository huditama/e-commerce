const express = require('express')
const router = express.Router()
const user = require('./user')
const product = require('./product')
const cart = require('./cart')
const transaction = require('./transaction')

router.use('/users', user)
router.use('/products', product)
router.use('/carts', cart)
router.use('/transactions', transaction)

module.exports = router