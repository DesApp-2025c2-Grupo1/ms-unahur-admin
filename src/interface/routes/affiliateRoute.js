const express = require("express");
<<<<<<< Updated upstream
const AffiliateRepository = require("../../infrastructure/repositories/AffiliateRepository");
const AffiliateService = require("../../use-cases/affiliates/AffiliateService");
const AffiliateController = require("../controller/AffiliateController");
const { validateAffiliate } = require("../validators/AffiliateValidator");
const { validateFields } = require("../middleware/validationMiddleware");
=======
const AffiliateController = require('../controller/AffiliateController');

// const { validateAffiliate } = require("../validators/AffiliateValidator");
// const { validateFields } = require("../middleware/validationMiddleware");
>>>>>>> Stashed changes

const router = express.Router();
const controller = new AffiliateController();




router.get("/affiliates", (req, res) => controller.findAll(req, res));
<<<<<<< Updated upstream
router.get("/affiliates/:dni", (req, res) => controller.getByDni(req, res));
router.put("/affiliates",(req, res) => controller.update(req, res));
router.delete("/affiliates/:dni", (req, res) => controller.deleteByDni(req, res));
router.get("/affiliates/family/:familyGroupId", (req, res) => controller.getByFamilyGroupId(req, res));
router.post("/affiliates", validateAffiliate, validateFields, (req, res) => controller.create(req, res));
=======

// router.get("/affiliates/:dni", (req, res) => controller.getByDni(req, res));
// router.put("/affiliates/:dni", validateFields, validateAffiliate, (req, res) => controller.update(req, res));
// router.delete("/affiliates/:dni", (req, res) => controller.deleteByDni(req, res));
// router.get("/affiliates/family/:familyGroupId", (req, res) => controller.getByFamilyGroupId(req, res));
// router.post("/affiliates", validateAffiliate, validateFields, (req, res) => controller.create(req, res));
>>>>>>> Stashed changes



module.exports = router;
