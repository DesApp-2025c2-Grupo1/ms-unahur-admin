import { Router } from "express";
import { AffiliateController } from "../controllers/AffiliateController";

const router = Router();

const affiliateController = new AffiliateController()

router.get('/', affiliateController.getAll.bind(affiliateController)); //me aseguro que apunte a mi controlador

router.get('/:credencial', affiliateController.byCredential.bind(affiliateController))

export { router as affiliateRoutes };