const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required!']
    },
    price: {
        type: Number,
        required: [true, 'Price is required!'],
        min: [0, 'Invalid Price']
    },
    image: {
        type: String,
        required: [true, 'Image is required!']
    },
    stock: {
        type: Number,
        required: [true, 'Stock is required!'],
        min: [0, 'Invalid Stock']

    }
})

productSchema.pre('findOneAndUpdate', function () {
    const { name, price, image, stock } = this.getUpdate()
    if (+price < 0 || +stock < 0) throw new Error('Invalid input!')
    if (!name || !price || !image || !stock) throw new Error('Invalid input!')
})

const Product = mongoose.model('Product', productSchema)

module.exports = Product