const Product = require('../models/product')

class productController {

    static findAll(req, res) {
        Product
            .find({})
            .then((allProducts) => { res.status(200).json(allProducts) })
            .catch((err) => { res.status(500).json(err) })
    }

    static create(req, res) {
        const { name, price, stock } = req.body
        let gcsUrl;
        if (!req.file) gcsUrl = `https://www.abortionno.org/wp-content/uploads/2016/02/no-image-found.jpg`
        else gcsUrl = req.file.gcsUrl
        Product
            .create({ name, price, stock, image: gcsUrl })
            .then((createdProduct) => { res.status(201).json({ message: 'Added a new product!', createdProduct }) })
            .catch((err) => { res.status(500).json(err) })
    }

    static update(req, res) {
        const { name, price, stock, image } = req.body
        const { ProductId } = req.params
        let gcsUrl;
        if (!req.file) gcsUrl = image
        else gcsUrl = req.file.gcsUrl
        Product
            .findOneAndUpdate({ _id: ProductId }, { name, price, stock, image: gcsUrl }, { new: true })
            .then((updatedProduct) => { res.status(200).json({ message: 'Updated a product!', updatedProduct }) })
            .catch((err) => {
                console.log(err)
                res.status(500).json(err)
            })
    }

    static delete(req, res) {
        const { ProductId } = req.params
        Product
            .findByIdAndDelete(ProductId)
            .then((deletedProduct) => { res.status(200).json({ message: 'Deleted a product!', deletedProduct }) })
            .catch((err) => { res.status(500).json(err) })
    }
}

module.exports = productController