const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');

router.post('/', async (req, res) => {
  try {
    const { entries } = req.body;
    if (!Array.isArray(entries)) return res.status(400).json({ error: 'entries must be an array' });
    const ops = entries.map(e => {
      const date = new Date(e.date);
      if (isNaN(date)) throw new Error('Invalid date in entries');
      return ({
        updateOne: {
          filter: { student: e.studentId, date },
          update: { $set: { status: e.status, batch: e.batch, note: e.note || '' } },
          upsert: true
        }
      });
    });
    const result = await Attendance.bulkWrite(ops);
    res.json(result);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.get('/', async (req, res) => {
  try {
    const { batch } = req.query;
    let { month, year } = req.query;
    const now = new Date();
    month = parseInt(month);
    year = parseInt(year);
    if (!month || !year) {
      // default to current month
      month = now.getMonth() + 1; // 1-12
      year = now.getFullYear();
    }
    if (month < 1 || month > 12) return res.status(400).json({ error: 'Invalid month' });
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);
    const filter = { date: { $gte: start, $lt: end } };
    if(batch) filter.batch = batch;
    const docs = await Attendance.find(filter).populate('student');
    res.json(docs);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
