const express = require('express');
const router = express.Router();
const Batch = require('../models/Batch');

router.get('/', async (req, res) => {
  try {
    const batches = await Batch.find();
    res.json(batches);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const batch = new Batch(req.body);
    await batch.save();
    res.status(201).json(batch);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

module.exports = router;
