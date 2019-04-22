const Cart = require('../models/cart')
const Product = require('../models/product')

class cartController {
    static create(req, res) {
        const { id } = req.authenticatedUser
        const { ProductId } = req.body
        Cart
            .create({ UserId: id, ProductId })
            .then((createdCart) => { res.status(201).json({ message: 'Created cart!', createdCart }) })
            .catch((err) => { res.status(500).json(err) })
    }

    static delete(req, res) {
        const { CartId } = req.params
        Cart
            .findByIdAndDelete(CartId)
            .then((deletedCart) => { res.status(200).json({ message: 'Deleted cart!', deletedCart }) })
            .catch((err) => { res.status(500).json(err) })
    }

    static findOne(req, res) {
        const { id } = req.authenticatedUser
        Cart
            .findOne({ UserId: id })
            .populate('products.ProductId')
            .then((findOneCart) => { res.status(200).json(findOneCart) })
            .catch((err) => { res.status(500).json(err) })
    }

    static addToCart(req, res) {
        const { id } = req.authenticatedUser
        const { ProductId, quantity } = req.body
        Cart
            .findOne({ UserId: id })
            .then((findOneCart) => {
                const { products } = findOneCart
                const findOneProduct = products.find((item) => {
                    return item.ProductId == ProductId
                })
                if (!findOneProduct) {
                    return Cart
                        .findOneAndUpdate({ UserId: id }, {
                            $push: {
                                products: { ProductId, quantity }
                            }
                        }, { new: true })
                        .populate('products.ProductId')
                } else {
                    return Cart
                        .findOneAndUpdate({
                            UserId: id,
                            'products.ProductId': ProductId
                        }, {
                                $inc: { 'products.$.quantity': quantity }
                            }, { new: true })
                        .populate('products.ProductId')

                }
            })
            .then((updatedCart) => { res.status(200).json({ message: 'Added to cart!', updatedCart }) })
            .catch((err) => { res.status(500).json(err) })
    }

    static addQuantity(req, res) {
        const { id } = req.authenticatedUser
        const { ProductId } = req.body
        Cart
            .findOneAndUpdate({
                UserId: id,
                'products.ProductId': ProductId
            }, {
                    $inc: { 'products.$.quantity': 1 }
                }, { new: true })
            .populate('products.ProductId')
            .then((updatedCart) => { res.status(200).json({ message: 'Added quantity!', updatedCart }) })
            .catch((err) => { res.status(500).json(err) })
    }

    static subtractQuantity(req, res) {
        const { id } = req.authenticatedUser
        const { ProductId } = req.body
        Cart
            .findOneAndUpdate({
                UserId: id,
                'products.ProductId': ProductId
            }, {
                    $inc: { 'products.$.quantity': -1 }
                }, { new: true })
            .populate('products.ProductId')
            .then((updatedCart) => { res.status(200).json({ message: 'Subtracted quantity!', updatedCart }) })
            .catch((err) => { res.status(500).json(err) })
    }

    static removeProduct(req, res) {
        const { id } = req.authenticatedUser
        const { ProductId } = req.body
        Cart
            .findOneAndUpdate({ UserId: id, 'products.ProductId': ProductId },
                {
                    $unset: {
                        'products.$': null
                    }
                }, { new: true })
            .then(() => {
                return Cart
                    .findOneAndUpdate({ UserId: id },
                        {
                            $pull: {
                                products: null
                            }
                        }, { new: true })
                    .populate('products.ProductId')
            })
            .then((updatedCart) => { res.status(200).json({ message: 'Removed product from your cart!', updatedCart }) })
            .catch((err) => { res.status(500).json(err) })
    }

    static checkout(req, res) {
        const { id } = req.authenticatedUser
        const { details } = req.body
        let ProductId = []
        let quantity = []
        for (let i = 0; i < details.length; i++) {
            ProductId.push(details[i].ProductId._id)
            quantity.push(details[i].quantity)
        }
        for (let i = 0; i < ProductId.length; i++) {
            for (let j = i + 1; j < ProductId.length; j++) {
                if (ProductId[i] > ProductId[j]) {
                    let sort = ProductId[i]
                    ProductId[i] = ProductId[j]
                    ProductId[j] = sort

                    let sort2 = quantity[i]
                    quantity[i] = quantity[j]
                    quantity[j] = sort2
                }
            }
        }
        Product
            .find({ _id: { $in: ProductId } })
            .then((findProducts) => {
                for (let i = 0; i < findProducts.length; i++) {
                    if (findProducts[i]._id == ProductId.sort()[i]) findProducts[i].stock -= quantity[i]
                }
                findProducts.map((x) => {
                    x.save()
                })
                return Cart
                    .findOneAndUpdate({ UserId: id }, { products: [] }, { new: true })
            })
            .then((updatedCart) => {
                res.status(200).json({ message: 'Thank you for shopping with us!', updatedCart })
            })
            .catch((err) => {
                console.log(err)
            })
    }
}

module.exports = cartController