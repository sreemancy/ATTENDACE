const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNumber: { type: String, required: true, unique: true },
  email: String,
  phone: String,
  address: String,
  batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: false },
  avatarUrl: String,
}, { timestamps: true });

module.exports = mongoose.model('Student', StudentSchema);
