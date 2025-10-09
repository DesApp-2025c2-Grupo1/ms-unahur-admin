import { Request, Response } from "express";
import { AffiliateContainer } from "../../infrastructure/containers/AffiliateContainer";

export class AffiliateController {

    private getAllAffiliates = AffiliateContainer.getAllAffiliatesUseCase();
    private getByCredential = AffiliateContainer.getByCredentialUseCase(); 

    async getAll(_req: Request, res: Response) {
        const affiliates = await this.getAllAffiliates.execute();
        res.json(affiliates);
    }

    async byCredential(req: Request, res: Response) {
        const credencial: string = String(req.params.credencial);
        const affiliate = await this.getByCredential.execute(credencial);
        console.log(affiliate);
        res.json(affiliate);
    }
}

