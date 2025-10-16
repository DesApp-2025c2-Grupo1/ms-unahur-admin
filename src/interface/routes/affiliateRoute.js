const express = require("express");
const ProviderRepository = require("../../infrastructure/repositories/AffiliateRepository");
const ProviderService = require("../../use-cases/providers/AffiliateService");
const ProviderController = require("../controller/ProviderController");

const router = express.Router();

// Instancias de los adaptadores y casos de uso
const providerRepository = new ProviderRepository();
const providerService = new ProviderService(providerRepository);
const providerController = new ProviderController(providerService);

// Rutas
router.get("/affiliates", (req, res) => providerController.list(req, res));
router.delete("/affiliates/:dni", (req, res) => providerController.delete(req, res));
router.post("/affiliates", (req, res) => providerController.create(req, res));
router.get("/affiliates/:field", (req, res) => providerController.list(req, res));
router.get("/affiliates/family/:familyGroupId", (req, res) => providerController.listFamilyGroup(req, res));

module.exports = router;
