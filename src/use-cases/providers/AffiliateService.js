class AffiliateService {

    constructor(affiliateRepository) {
        this.affiliateRepository = affiliateRepository;
    }

    async findAll() {
        return await this.affiliateRepository.findAll();
    }

    async createAffiliate(data) {
        if (!data) {
            throw new Error("Affiliate data is required");
        }
        // console.log(data);
        return await this.affiliateRepository.create(data);
    }

    async getTherapeuticSituationsByDni(dni) {
        if (!dni) {
            throw new Error("DNI is required");
        }

        // verificar existencia del afiliado
        const exists = await this.affiliateRepository.existByDni(dni);
        if (!exists) {
            return null; // controller manejará 404
        }

        return await this.affiliateRepository.getTherapeuticSituationsByDni(dni);
    }

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
