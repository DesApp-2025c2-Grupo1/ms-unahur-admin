const AffiliateRepository2 = require('../repositories/AffiliateRepository2')
const AffiliateEmailService = require('./AffiliateEmailService')

const repository = new AffiliateRepository2();
const affiliateEmailService = new AffiliateEmailService();


class AffiliateService {

    async findAll() {
        const affiliates = await repository.findAll();
        console.log(affiliates[0].grupoFamiliar)
        return affiliates;
    }

    async delete(dni) {
        //obtengo el grupo familiar
        const groupId = await repository.getFamilyGroupNumber(dni)

        //busco los dni de los familiares
        const dnis = (await this.getDnis(groupId)).map(d => d.dni);

        console.log(dnis)

        //elimino los correos de todos
        await affiliateEmailService.delete(dnis);

        await repository.delete(dnis);

        //elimino las situaciones


    }

    async create(data) {
        const { familyGroup } = data; //grupo familiar
    }

    async getDnis(groupId) {
        return await repository.getDniOfTheFamilyGroup(groupId)
    }
}

module.exports = AffiliateService;
