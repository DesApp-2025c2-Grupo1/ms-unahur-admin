import { AffiliateSituation } from "../entities/AffiliateSituation";

export interface AffiliateSituationRepository {
    getAffiliateSituationByDni(dni: string):  Promise<AffiliateSituation | null>;
}