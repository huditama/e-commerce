const mongoose = require('mongoose')
const Schema = mongoose.Schema

const transactionSchema = new Schema({
    UserId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    cart: [{
        ProductId: {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: {
            type: Number
        }
    }],
    createdAt: {
        type: Date,
        default: new Date()
    }
})

const Transaction = mongoose.model('Transaction', transactionSchema)

module.exports = Transaction