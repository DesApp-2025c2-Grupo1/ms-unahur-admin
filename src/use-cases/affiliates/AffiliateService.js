class AffiliateService {

    constructor(affiliateRepository) {
        this.affiliateRepository = affiliateRepository;
    }

    async findAll() {
        return await this.affiliateRepository.findAll();
    }

    async createAffiliate(data) {
        if (!data) {
            throw new Error("Los datos del afiliado son requeridos");
        }
        // console.log(data);
        return await this.affiliateRepository.create(data);
    }

    async upateAffiliate(data) {
        if (!data) {
            throw new Error("Los datos del afiliado son requeridos");
        }
        // console.log(data);
        return await this.affiliateRepository.update(data);
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


    async deleteAffiliate(dni) {
        if (!dni) throw new Error("DNI es requerido para eliminar afiliado");
        return await this.affiliateRepository.deleteByDni(dni);
    }




    // async deleteAffiliate(identifier) {
    //     if (!identifier) {
    //         throw new Error("Identifier is required to delete an affiliate");
    //     }
    //     return await this.affiliateRepository.delete(identifier);
    // }

    async listFamilyGroup(familyGroupId) {
        if (!familyGroupId || isNaN(parseInt(familyGroupId))) {
            throw new Error("ID de grupo familiar inválido");
        }

        const exists = await this.affiliateRepository.existFamilyGroup(familyGroupId);
        if (!exists) {
            return null; // controller -> 404
        }

        const result = await this.affiliateRepository.listFamilyGroup(familyGroupId);

        // ordenar para que el Titular vaya primero
        if (result && result.afiliados) {
            result.afiliados.sort((a, b) => (a.parentesco === 'Titular' ? -1 : (b.parentesco === 'Titular' ? 1 : 0)));
        }

        return result;
    }
}

module.exports = AffiliateService;
