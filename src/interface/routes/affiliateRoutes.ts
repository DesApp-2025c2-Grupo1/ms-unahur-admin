import { Router } from "express";
import { AffiliateController } from "../controllers/AffiliateController";

const router = Router();

const affiliateController = new AffiliateController()

router.get('/', affiliateController.getAll.bind(affiliateController)); //me aseguro que apunte a mi controlador

//find generico par obtener afiliados
router.get('/find', affiliateController.byField.bind(affiliateController))

export { router as affiliateRoutes };