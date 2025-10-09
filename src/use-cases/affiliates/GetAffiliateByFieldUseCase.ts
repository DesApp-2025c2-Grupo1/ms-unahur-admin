import { AffiliatesRepository } from "../../domain/interfaces/AffiliatesRepository";

export class GetAffiliateByField {
    constructor(private affiliateRepository: AffiliatesRepository) { }

    async execute(field: string, value: any) {
        return await this.affiliateRepository.findByField(field, value);
    }
}