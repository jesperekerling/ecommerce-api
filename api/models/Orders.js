const mongoose = require('mongoose');

const ordersSchema = new mongoose.Schema({
    user: String,
    products: [
      {
        quantity: Number,
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product'
        },
      },
    ],
    totalPrice: Number
  }, { timestamps: true });

module.exports = mongoose.model('Orders', ordersSchema);