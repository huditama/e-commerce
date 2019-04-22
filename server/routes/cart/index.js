const express = require('express')
const router = express.Router()
const cartController = require('../../controllers/cartController')
const authenticate = require('../../middlewares/authenticate')
const isThatUser = require('../../middlewares/isThatUser')

router.use(authenticate)
router.use(isThatUser)
router.get('/', cartController.findOne)
router.post('/', cartController.create)
router.delete('/:CartId', cartController.delete)
router.patch('/addToCart', cartController.addToCart)
router.patch('/addQuantity', cartController.addQuantity)
router.patch('/subtractQuantity', cartController.subtractQuantity)
router.patch('/removeProduct', cartController.removeProduct)
router.patch('/checkout', cartController.checkout)

module.exports = router