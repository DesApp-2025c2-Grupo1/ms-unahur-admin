class AffiliateService {
    constructor(affiliateRepository) {
        this.affiliateRepository = affiliateRepository;
    }

    async findAll() {
        return await this.affiliateRepository.findAll();
    }


    // async createAffiliate(data) {
    //     if (!data) {
    //         throw new Error("Affiliate data is required");
    //     }
    //     return await this.affiliateRepository.create(data);
    // }

    // async deleteAffiliate(identifier) {
    //     if (!identifier) {
    //         throw new Error("Identifier is required to delete an affiliate");
    //     }
    //     return await this.affiliateRepository.delete(identifier);
    // }

    // async listFamilyGroup(familyGroupId) {
    //     if (!familyGroupId) {
    //         throw new Error("Family group ID is required");
    //     }
    //     return await this.affiliateRepository.listFamilyGroup(familyGroupId);
    // }
}

module.exports = AffiliateService;
