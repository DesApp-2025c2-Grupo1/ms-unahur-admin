
import { GetAffiliateSituationByDni } from "../../use-cases/affiliateSituation/GetAffiliateSituationByDniUseCase";
import { InMemoryAffiliateSituationRepository } from "../repositories/InMemoryAffiliateSituationRepository";

export class AffiliateSituationContainer {

    private static _affiliateSituationRepository = new InMemoryAffiliateSituationRepository();

    static getAffiliateSituationRepository() {
        return this._affiliateSituationRepository;
    }

    static getAffiliateSituationByDniUseCase() {
        return new GetAffiliateSituationByDni(this._affiliateSituationRepository)
    }
}