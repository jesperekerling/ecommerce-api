const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: Number,
      },
    ],
    totalPrice: Number,
  });
  

module.exports = mongoose.model('Orders', orderSchema);

