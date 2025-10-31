const express = require('express');
const ProviderRepository = require('../../infrastructure/repositories/ProviderRepository');
const ProviderService = require('../../use-cases/providers/ProviderService');
const ProviderController = require('../controller/ProviderController');

const router = express.Router();

const repository = new ProviderRepository();
const service = new ProviderService(repository);
const controller = new ProviderController(service);

// GET /providers -> list providers with lugar, telefonos, mails y especialidades
router.get('/providers', controller.findAll);

// GET /providers/:cuit -> get single provider (helper)
router.get('/providers/:cuit', controller.findByCuitCuil);

module.exports = router;
