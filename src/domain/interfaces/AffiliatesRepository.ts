import { Affiliate } from "../entities/Affiliate";

export interface AffiliateRepository {
    findAll(): Promise<Affiliate[]>;
    findByCredential(credencial: string): Promise<Affiliate | null>;
}