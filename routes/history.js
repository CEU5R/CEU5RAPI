const express = require('express');
const {
    getHistory,
} = require('../controllers/history');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router
    .route('/:id')
    .get(getHistory)

module.exports = router;
