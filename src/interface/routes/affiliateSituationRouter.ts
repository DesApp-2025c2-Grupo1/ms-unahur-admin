import { Router } from "express";
import { AffiliateController } from "../controllers/AffiliateController";
import { AffiliateSituationController } from "../controllers/AffiliateSituationController";

const router = Router();
const affiliateSituationController = new AffiliateSituationController();

router.get('/:dni', affiliateSituationController.byDni.bind(affiliateSituationController));

export {router as affiliateSituationRouter}