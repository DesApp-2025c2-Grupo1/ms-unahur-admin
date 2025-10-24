const express = require("express");


const AffiliateRepository = require("../../infrastructure/repositories/AffiliateRepository");
const AffiliateService = require("../../use-cases/providers/AffiliateService");
const AffiliateController = require("../controller/AffiliateController");

const router = express.Router();


const affiliateRepository = new AffiliateRepository();
const affiliateService = new AffiliateService(affiliateRepository);
const affiliateController = new AffiliateController(affiliateService);


router.get("/affiliates", (req, res) => affiliateController.findAll(req, res)); 
router.post("/affiliates", (req, res) => affiliateController.create(req, res));
router.get("/affiliates/:dni/situaciones_terapeuticas", (req, res) => affiliateController.getSituationsByDni(req, res));
// router.delete("/affiliates/:dni", (req, res) => affiliateController.delete(req, res));
// router.get("/affiliates/:field", (req, res) => affiliateController.list(req, res));
// router.get("/affiliates/family/:familyGroupId", (req, res) => affiliateController.listFamilyGroup(req, res));

module.exports = router;
