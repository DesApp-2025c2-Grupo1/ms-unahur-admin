const AffiliateRepository = require('@repositories/AffiliateRepository2');
const AffiliateEmailService = require('@services/AffiliateEmailService');
const AffiliateTelephoneService = require('@services/AffiliateTelephoneService');
const AffiliateSituationService = require('@services/AffiliateSituationService');

class AffiliateService {
    constructor(
        repo = new AffiliateRepository(),
        emailServ = new AffiliateEmailService(),
        telService = new AffiliateTelephoneService(),
        affiliateSituation = new AffiliateSituationService()
    ) {
        this.repo = repo;
        this.emailServ = emailServ;
        this.telService = telService;
        this.affiliateSituation = affiliateSituation;
    }

    // Métodos principales
    findAll() {
        return this.repo.findAll();
    }

    async create(affiliate) {
        const emails = this.getEmails(affiliate.emails);
        const situations = this.getSituations(affiliate.situaciones);
        const telephones = this.getTelephones(affiliate.telefonos);

        const count = await this.repo.getCount();

        console.log(count)
        // TODO: Implementar lógica de creación
        console.log({ emails, situations, telephones });
    }

    async delete(dni) {
        const familyGroup = await this.repo.getFamilyGroupNumber(dni);
        if (!familyGroup) {
            throw new Error(`No se encontró grupo familiar para el DNI ${dni}`);
        }

        const dniList = await this.getFamilyGroupDniList(familyGroup.idGrupoFamiliarFK);
        await this.deleteAffiliateAndRelatedData(dniList);
    }

    // Métodos auxiliares
    async getFamilyGroupDniList(familyGroupId) {
        const familyMembers = await this.repo.getDniOfTheFamilyGroup(familyGroupId);
        return familyMembers.map(f => f.dni);
    }

    // Método para eliminar información relacionada
    async deleteAffiliateAndRelatedData(dniList) {
        await this.repo.delete(dniList);
        await Promise.allSettled([
            this.emailServ.delete(dniList),
            this.telService.delete(dniList),
            this.affiliateSituation.delete(dniList)
        ]);
    }

    // Métodos de extracción de datos
    getEmails(emailList) {
        return emailList.map(e => e.email);
    }

    getTelephones(telephoneList) {
        return telephoneList.map(t => t.telefono);
    }

    getSituations(situationList) {
        return situationList.map(s => s);
    }
}

module.exports = AffiliateService;
