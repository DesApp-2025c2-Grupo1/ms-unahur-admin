const express = require("express");

const PlanRepository = require("../../infrastructure/repositories/PlanRepository");
const PlanService = require("../../use-cases/plans/PlanService");
const PlanController = require("../controller/PlanController");

const router = express.Router();

const repository = new PlanRepository();
const service = new PlanService(repository);
const controller = new PlanController(service);

router.get("/plans", (req, res) => controller.findAll(req, res));

module.exports = router;