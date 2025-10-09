import { AffiliateEntity } from "../../infrastructure/database/entities/AffiliateEntity";
import { Affiliate } from "../entities/Affiliate";

export interface AffiliatesRepository {
    findAll(): Promise<Affiliate[]>;
    findByField(field: string, value: any): Promise<Affiliate | null>;
}