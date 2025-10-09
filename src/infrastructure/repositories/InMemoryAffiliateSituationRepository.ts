import { AffiliateSituation } from "../../domain/entities/AffiliateSituation";
import { AffiliateSituationRepository } from "../../domain/interfaces/AffiliateSituationRepository";
import { affiliateSituations } from "../database/mock/affiliateSituation";

export class InMemoryAffiliateSituationRepository implements AffiliateSituationRepository {

    private affiliateSituation: AffiliateSituation[] = affiliateSituations;

    async getAffiliateSituationByDni(dni: string): Promise<AffiliateSituation | null> {
        const affiliateSituation = this.affiliateSituation.find(affiliate => affiliate.dni == dni);
        console.log(affiliateSituation)
        return affiliateSituation || null;
    }

}