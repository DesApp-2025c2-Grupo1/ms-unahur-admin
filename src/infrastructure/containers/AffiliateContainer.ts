import { GetAllAffiliates } from "../../use-cases/affiliates/GetAllAffiliatesUseCase";
import { GetByCredential } from "../../use-cases/affiliates/GetByCredentialUseCase";
import { InMemoryAffiliateRepository } from "../repositories/InMemoryAffiliateRepository";

class AffiliateContainer {

    //repositorio en memoria
    private static _affiliateRepository = new InMemoryAffiliateRepository();

    static getAffiliateRepository() {
        return this._affiliateRepository;
    }

    static getAllAffiliatesUseCase() {
        return new GetAllAffiliates(this._affiliateRepository);
    }

    static getByCredentialUseCase() {
        return new GetByCredential(this._affiliateRepository);
    }
}

export { AffiliateContainer }