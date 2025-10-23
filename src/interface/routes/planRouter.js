const express = require("express");

const PlanRepository = require("../../infrastructure/repositories/PlanRepository");
const PlanService = require("../../use-cases/plans/PlanService");
const PlanController = require("../controller/PlanController");

const router = express.Router();

const planRepository = new PlanRepository();
const planService = new PlanService(planRepository);
const planController = new PlanController(planService);


router.get("/plans", (req, res) => planController.findAll(req, res));

module.exports = router;