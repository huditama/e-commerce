const express = require('express')
const router = express.Router()
const transactionController = require('../../controllers/transactionController')
const authenticate = require('../../middlewares/authenticate')

router.use(authenticate)
router.post('/', transactionController.create)
router.get('/', transactionController.findAll)

module.exports = router