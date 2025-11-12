const express = require("express");
const AffiliateController = require('@controllers/AffiliateController');

// const { validateAffiliate } = require("../validators/AffiliateValidator");
// const { validateFields } = require("../middleware/validationMiddleware");

const router = express.Router();
const controller = new AffiliateController();

router.get("/affiliates", (req, res) => controller.findAll(req, res));
router.post("/affiliates", (req, res) => controller.create(req, res));
router.delete('/affiliates/:dni', (req, res) => controller.delete(req, res));
router.put("/affiliates/:dni", (req, res) => controller.update(req, res));
router.put("/affiliates/email/:dni", (req, res) => controller.deleteEmail(req, res))
router.put("/affiliates/telephone/:dni", (req, res) => controller.deleteTelephone(req, res))
router.get("/affiliates/family/:dni", (req, res) => controller.getFamilyGroup(req, res));
router.get("/affiliates/affiliate/:dni", (req, res) => controller.getAffiliateByDni(req, res));
router.put("/affiliates/:dni/plan", (req, res) => controller.updatePlan(req, res));

module.exports = router;
