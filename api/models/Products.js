const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  category: String,
  images: [String]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);