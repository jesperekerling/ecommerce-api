const mongoose = require('mongoose');

const messagesSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
}, { timestamps: true });

module.exports = mongoose.model('Messages', messagesSchema);