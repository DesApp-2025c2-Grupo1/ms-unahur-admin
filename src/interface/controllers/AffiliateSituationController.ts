import { Request, Response } from "express";
import { AffiliateSituationContainer } from "../../infrastructure/containers/AffiliateSituationContainer";

export class AffiliateSituationController {

    private getAffiliateSituationByDni = AffiliateSituationContainer.getAffiliateSituationByDniUseCase();

    async byDni(req: Request, res: Response) {
        const dni = String(req.params.dni);
        console.log(dni)
        const affiliateSituation = await this.getAffiliateSituationByDni.execute(dni)
        console.log(affiliateSituation);
        res.json(affiliateSituation);
    }

}