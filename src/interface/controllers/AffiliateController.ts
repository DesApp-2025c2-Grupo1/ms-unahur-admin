import { Request, Response } from "express";
import { AffiliateContainer } from "../../infrastructure/containers/AffiliateContainer";

export class AffiliateController {

    private getAllAffiliates = AffiliateContainer.getAllAffiliatesUseCase();
    private getByCredential = AffiliateContainer.getAffiliateByFieldUseCase();

    async getAll(_req: Request, res: Response) {
        const affiliates = await this.getAllAffiliates.execute();
        res.json(affiliates);
    }

    async byField(req: Request, res: Response) {
        const { field, value } = req.query;
        
        const fieldStr = String(field);
        const valueStr = String(value);

        const affiliate = await this.getByCredential.execute(fieldStr, valueStr);

        res.json(affiliate);
    }
}

