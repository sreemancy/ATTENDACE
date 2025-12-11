const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch' },
  date: { type: Date, required: true },
  status: { type: String, enum: ['present','late','undertime','absent'], default: 'present' },
  note: String
}, { timestamps: true });

AttendanceSchema.index({ student: 1, date: 1 }, { unique: true });
module.exports = mongoose.model('Attendance', AttendanceSchema);
