
const express = require('express');
const mongoose = require('mongoose');

const User = require('./models/User');

const app = express();

app.use(express.json());

const db = require("./db-config")

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


import dotenv from 'dotenv';
import JWT_SECRET from 'jwt.env';
const jwtSecret = process.env.JWT_SECRET;


/*

API Requests
(API URL / Functionality)

/products/all - GET all products
/produtcs/:id - GET specific product from ID
/products - POST create product
/products/:id - PUT update product
/products/:id - DELETE delete product

/messages/all - GET all messages
/messages/:id - GET specific message
/message - POST send message

/orders - GET all orders (Bearer token required)
/orders - POST create order (Bearer token required)

/register - POST register user
/login - POST login user


*/


function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Token error' });
  }

  const token = parts[1];
  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Failed to authenticate token' });
    }

    req.user = user;
    next();
  });
}





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

// Define the Order schema
const orderSchema = new mongoose.Schema({
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


// Schemas End


// Models

const Product = mongoose.model('Product', productSchema);
const Message = mongoose.model('Message', messageSchema);
const Order = mongoose.model('Order', orderSchema);
// Models End



// API Requests


// GET all products
app.get('/products/all', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});


// GET specific product
app.get('/products/:id', async (req, res, next) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid product ID' });
  }
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
});



// Error handling middleware for all other errors
app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }

  res.status(500).json({ error: 'Something went wrong!' });
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

// POST Product/products
app.post('/products', async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
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




// POST /orders route
app.post('/orders', authenticate, async (req, res) => {
  try {
    const order = new Order({
      user: req.user.id, // Use the user ID from the token
      products: req.body.products,
      totalPrice: req.body.totalPrice,
    });
    await order.save();
    res.status(201).send(order);
  } catch (error) {
    res.status(400).send(error);
  }
});

// GET /orders route
app.get('/orders', authenticate, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id });
    if (orders.length === 0) {
      res.status(200).send('No orders yet.');
    } else {
      res.status(200).send(orders);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});




// Register
app.post('/register', async (req, res) => {
  try {
    // Check if a user with the provided username already exists
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      password: hashedPassword
    });
    const savedUser = await user.save();

    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
app.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const passwordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Get if token is valid
app.get('/check-token', authenticate, (req, res) => {
  res.status(200).send({ valid: true, userId: req.user.id });
});




app.listen(3000, () => console.log('Server started at port 3000'));