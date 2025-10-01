import { AffiliateRepository } from "../../domain/interfaces/AffiliatesRepository";

export class GetAllAffiliates {
    constructor(private affiliateRepository: AffiliateRepository) { }

    async execute() {
        return await this.affiliateRepository.findAll();
    }
}