const express = require("express");
const AffiliateController = require('@controllers/TherapeuticSituationController');

const router = express.Router();
const controller = new AffiliateController()

router.get("/therapeutic", (req, res) => controller.findAll(req, res));
router.get("/therapeutic/:id", (req, res) => controller.findById(req, res));

module.exports = router;
