const mongoose = require('mongoose');

const ordersSchema = new mongoose.Schema({
    user: String,
    products: [
      {
        quantity: Number,
        product: {
          _id: String,
          name: String,
          price: Number,
          description: String,
          category: String,
          images: [String],
          createdAt: Date,
          updatedAt: Date,
        },
      },
    ],
    totalPrice: Number,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  }, { timestamps: true });
  

module.exports = mongoose.model('Orders', ordersSchema);

