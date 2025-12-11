const Student = require('../models/Student');
const Batch = require('../models/Batch');

exports.getAllStudents = async (req, res) => {
  try {
    const { batch } = req.query;
    const query = batch ? { batch } : {};
    const students = await Student.find(query).populate('batch');
    res.json(students);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('batch');
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.createStudent = async (req, res) => {
  try {
    console.log('Creating student with data:', req.body);
    const payload = { ...req.body };

    // If batch is provided as a string name, resolve or create a Batch document
    if (payload.batch && typeof payload.batch === 'string') {
      // If it's a 24-char hex string, let mongoose cast it; otherwise treat as name
      const isObjectIdLike = /^[0-9a-fA-F]{24}$/.test(payload.batch);
      if (!isObjectIdLike) {
        let batchDoc = await Batch.findOne({ name: payload.batch });
        if (!batchDoc) {
          batchDoc = await Batch.create({ name: payload.batch });
        }
        payload.batch = batchDoc._id;
      }
    }

    const s = new Student(payload);
    await s.save();
    console.log('Student created successfully:', s);
    res.status(201).json(s);
  } catch (err) { 
    console.error('Error creating student:', err);
    // If validation errors exist, return structured messages
    if (err.name === 'ValidationError' && err.errors) {
      const errors = Object.keys(err.errors).reduce((acc, key) => {
        acc[key] = err.errors[key].message;
        return acc;
      }, {});
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }
    res.status(400).json({ error: err.message }); 
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (err) { res.status(400).json({ error: err.message }); }
};

exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json({ message: 'Student deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
