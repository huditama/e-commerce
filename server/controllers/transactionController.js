const Transaction = require('../models/transaction')

class transactionController {
    static findAll(req, res) {
        Transaction
            .find({})
            .populate('UserId')
            .populate('cart.ProductId')
            .then((allTransactions) => { res.status(200).json(allTransactions) })
            .catch((err) => { res.status(500).json(err) })
    }

    static create(req, res) {
        const { details } = req.body
        let cart = []
        let obj = {}
        details.forEach((x) => {
            obj['ProductId'] = x.ProductId._id
            obj['quantity'] = x.quantity
            cart.push(obj)
            obj = {}
        })
        Transaction
            .create({ UserId: req.authenticatedUser.id, cart })
            .then((createdTransaction) => { res.status(201).json(createdTransaction) })
            .catch((err) => { res.status(500).json(err) })
    }
}

module.exports = transactionController