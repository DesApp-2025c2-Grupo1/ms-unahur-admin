const express = require('express');
const ProviderRepository = require('../../infrastructure/repositories/ProviderRepository');
const ProviderService = require('../../use-cases/providers/ProviderService');
const ProviderController = require('../controllers/ProviderController');


const router = express.Router();

const repository = new ProviderRepository();
const service = new ProviderService(repository);
const controller = new ProviderController(service);

const { validateProviderCreate, validateProviderUpdate } = require('../validators/ProviderValidator');
const { validateFields } = require('../middlewares/validationMiddleware');

// GET /providers -> list providers with lugar, telefonos, mails y especialidades
router.get('/providers', controller.findAll);

// GET /providers/:cuit -> get single provider (helper)
router.get('/providers/:cuit', controller.findByCuitCuil);

// POST /providers -> create
router.post('/providers', validateProviderCreate, validateFields, (req, res) => controller.create(req, res));

// PUT /providers/:cuit -> update
router.put('/providers/:cuit', validateProviderUpdate, validateFields, (req, res) => controller.update(req, res));

// DELETE /providers/:cuit -> delete
router.delete('/providers/:cuit', (req, res) => controller.delete(req, res));

module.exports = router;
