const express = require('express')
const router = express.Router()
const productController = require('../../controllers/productController')
const authenticate = require('../../middlewares/authenticate')
const authorize = require('../../middlewares/authorize')
const Multer = require('multer');
const gcsMiddlewares = require('../../middlewares/google-cloud-storage')
const multer = Multer({
    storage: Multer.MemoryStorage,
    limits: {
        fileSize: 10 * 1024 * 1024, // Maximum file size is 10MB
    },
});

router.use(authenticate)
router.get('/', productController.findAll)
router.use(authorize)
router.post('/', multer.single('image'), gcsMiddlewares.sendUploadToGCS, productController.create)
router.patch('/:ProductId', multer.single('image'), gcsMiddlewares.sendUploadToGCS, productController.update)
router.delete('/:ProductId', productController.delete)

module.exports = router