import { AffiliateRepository } from "../../domain/interfaces/AffiliatesRepository";

export class GetByCredential {
    constructor(private affiliateRepository: AffiliateRepository) { }

    async execute(credencial: string) {
        return await this.affiliateRepository.findByCredential(credencial);
    }
}