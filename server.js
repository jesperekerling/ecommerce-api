const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use(express.json());

const db = require("./db-config")





// Schemas

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    category: String,
    images: [String],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const messageSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
});
// Schemas End


// Models

const Product = mongoose.model('Product', productSchema);
const Message = mongoose.model('Message', messageSchema);
// Models End



// API Requests


// Get all products
app.get('/products/all', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});


// Get specific product
app.get('/products/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.json(product);
});




// Post products (in JSON format)
app.post('/products', async (req, res) => {
    const products = Array.isArray(req.body) ? req.body : [req.body];
    const savedProducts = [];

    for (let product of products) {
        const newProduct = new Product(product);
        try {
            const savedProduct = await newProduct.save();
            savedProducts.push(savedProduct);
        } catch (err) {
            return res.status(400).send(err);
        }
    }

    res.status(201).json(savedProducts);
});

// Update product
app.put('/products/:id', async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(product);
});

// Delete product
app.delete('/products/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Produkten har tagits bort' });
});




// Send message
app.post('/message', async (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      res.status(400).json({ message: 'Alla fält måste fyllas i' });
    } else {
      const newMessage = new Message({ name, email, message });
      await newMessage.save();
      res.status(200).json({ message: 'Meddelandet har skickats och sparats i databasen.' });
    }
  });

// Get all messages
app.get('/messages/all', async (req, res) => {
  try {
      const messages = await Message.find();
      res.status(200).json(messages);
  } catch (err) {
      res.status(500).send(err);
  }
});

// Get specific message
app.get('/messages/:id', async (req, res) => {
  const id = req.params.id;

  // Check if the provided ID is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send('Invalid message ID');
  }

  try {
      const message = await Message.findById(id);
      if (message) {
          res.status(200).json(message);
      } else {
          res.status(404).send('Message not found');
      }
  } catch (err) {
      res.status(500).send(err);
  }
});
// API Requests End



app.listen(3000, () => console.log('Servern körs på port 3000'));