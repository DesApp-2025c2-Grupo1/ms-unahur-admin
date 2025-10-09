import { GetAllAffiliates } from "../../use-cases/affiliates/GetAllAffiliatesUseCase";
import { GetAffiliateByField } from "../../use-cases/affiliates/GetAffiliateByFieldUseCase";
import { AffiliateRepository } from "../repositories/AffiliateRepository";
import { InMemoryAffiliateRepository } from "../repositories/InMemoryAffiliateRepository";


class AffiliateContainer {

    //modificar dependiendo de que quiera usar
    private static _affiliateRepository = new AffiliateRepository; //clase concreta

    static getAffiliateRepository() {
        return this._affiliateRepository;
    }

    static getAllAffiliatesUseCase() {
        return new GetAllAffiliates(this._affiliateRepository);
    }

    static getAffiliateByFieldUseCase() {
        return new GetAffiliateByField(this._affiliateRepository);
    }
}

export { AffiliateContainer }