const express = require("express");

const TherapeuticSituationRepository = require("../../infrastructure/repositories/TherapeuticSituationRepository");
const TherapeuticSituationService = require("../../use-cases/providers/TherapeuticSituationService");
const TherapeuticSituationController = require("../controller/TherapeuticSituationController");

const router = express.Router();

const repository = new TherapeuticSituationRepository();
const service = new TherapeuticSituationService(repository);
const controller = new TherapeuticSituationController(service);

router.get("/therapeutic", (req, res) => controller.findAll(req, res));
router.get("/therapeutic/:id", (req, res) => controller.findById(req, res));

module.exports = router;
