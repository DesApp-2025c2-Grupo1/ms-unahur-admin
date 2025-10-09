import { Affiliate } from "../../domain/entities/Affiliate";
import { AffiliatesRepository } from "../../domain/interfaces/AffiliatesRepository";
import { affiliates } from "../database/affiliates";

export class InMemoryAffiliateRepository implements AffiliatesRepository {


    private affiliates: Affiliate[] = affiliates;

    async findAll(): Promise<Affiliate[]> {
        return this.affiliates;
    }

    async findByField(credencial: string): Promise<Affiliate | null> {
        const affiliate = this.affiliates.find(a => a.credencial === credencial);
        return affiliate || null;
    }

}