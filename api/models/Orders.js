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
    totalPrice: Number,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  }, { timestamps: true });
  

module.exports = mongoose.model('Orders', ordersSchema);

