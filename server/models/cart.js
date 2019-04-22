const mongoose = require('mongoose')
const Schema = mongoose.Schema

const cartSchema = new Schema({
    UserId: { type: Schema.Types.ObjectId, ref: 'User' },
    products: [{
        ProductId: { type: Schema.Types.ObjectId, ref: 'Product' },
        quantity: {
            type: Number,
            min: [1, 'A minimum quantity of 1 is required!']
        }
    }]
})

let Cart = mongoose.model('Cart', cartSchema)

module.exports = Cart