const mongoose = require('mongoose');

const BatchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  year: Number
});

module.exports = mongoose.model('Batch', BatchSchema);
