import { Affiliate } from "../../domain/entities/Affiliate";
import { AffiliateRepository } from "../../domain/interfaces/AffiliatesRepository";
import { affiliates } from "../database/affiliates";

export class InMemoryAffiliateRepository implements AffiliateRepository {


    private affiliates: Affiliate[] = affiliates;

    async findAll(): Promise<Affiliate[]> {
        return this.affiliates;
    }

    async findByCredential(credencial: string): Promise<Affiliate | null> {
        const affiliate = this.affiliates.find(a => a.credencial === credencial);
        return affiliate || null;
    }

}