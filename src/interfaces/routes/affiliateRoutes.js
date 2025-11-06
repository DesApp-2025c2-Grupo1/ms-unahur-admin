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
// router.get("/affiliates/:dni", (req, res) => controller.getByDni(req, res));
// router.put("/affiliates/:dni", validateFields, validateAffiliate, (req, res) => controller.update(req, res));
// router.delete("/affiliates/:dni", (req, res) => controller.deleteByDni(req, res));
router.get("/affiliates/family/:dni", (req, res) => controller.getFamilyGroup(req, res));
// router.post("/affiliates", validateAffiliate, validateFields, (req, res) => controller.create(req, res));



module.exports = router;
