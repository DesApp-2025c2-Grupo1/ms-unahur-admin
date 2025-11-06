const express = require('express');
const router = express.Router();
const SpecialtyController = require('../controllers/SpecialtyController');

// Spanish
router.get('/especialidades', (req, res) => SpecialtyController.findAll(req, res));
router.get('/especialidades/:id', (req, res) => SpecialtyController.findById(req, res));

// English alternative
router.get('/specialties', (req, res) => SpecialtyController.findAll(req, res));
router.get('/specialties/:id', (req, res) => SpecialtyController.findById(req, res));

module.exports = router;
