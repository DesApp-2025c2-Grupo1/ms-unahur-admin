const express = require("express");
const PlanController = require('../controller/PlanController');

const controller = new PlanController();
const router = express.Router();


router.get("/plans", (req, res) => controller.findAll(req, res));

module.exports = router;