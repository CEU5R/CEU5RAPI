const express = require('express');
const {
    createDepartment,
    getDepartments,
    updateDepartment,
    deleteDepartment,
} = require('../controllers/department');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router
    .route('/')
    .post(protect, authorize('admin'), createDepartment)
    .get(protect, authorize('admin'), getDepartments)

router
    .route('/:id')
    .put(protect, authorize('admin'), updateDepartment)
    .put(protect, authorize('admin'), deleteDepartment)

module.exports = router;
