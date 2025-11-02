const AffiliateRepository = require('@repositories/AffiliateRepository');
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

    // Listar todos los afiliados
    findAll() {
        return this.repo.findAll();
    }

    // Crear afiliado principal y sus familiares
    async createAffiliate(affiliate) {
        if (await this.exists(affiliate.dni)) {
            throw new Error(`El afiliado con DNI ${affiliate.dni} ya existe.`);
        }

        // Crear titular
        const holder = await this.createHolder(affiliate);
        const baseCredencial = holder.credencial.split('-')[0];

        // Crear familiares si existen
        if (affiliate.familiares?.length > 0) {
            for (const [index, fam] of affiliate.familiares.entries()) {
                await this.createFamilyMember(fam, baseCredencial, index, affiliate.plan);
            }
        }

        return holder;
    }

    // Crear el titular
    async createHolder(holderData) {
        const emails = this.getEmails(holderData.emails);
        const situations = this.getSituations(holderData.situaciones);
        const telephones = this.getTelephones(holderData.telefonos);

        const count = await this.repo.getCount();
        const nextFamilyNumber = count + 1;
        const baseCredencial = nextFamilyNumber.toString().padStart(7, '0');

        return await this.repo.create(holderData, baseCredencial, emails, telephones, situations, holderData.plan);
    }

    // Crear un familiar
    async createFamilyMember(familyData, baseCredencial, index, plan) {
        const emails = this.getEmails(familyData.emails);
        const situations = this.getSituations(familyData.situaciones);
        const telephones = this.getTelephones(familyData.telefonos);

        // La credencial del familiar toma la del titular + sufijo incremental
        const credencialFamiliar = `${baseCredencial}-${(index + 2).toString().padStart(2, '0')}`;

        // El plan del familiar es el mismo que el del titular
        return await this.repo.create({ ...familyData, plan }, credencialFamiliar, emails, telephones, situations, plan);
    }

    // Editar un afiliado
    async updateAffiliate(dni, data) {
        // Verificar si el afiliado existe
        if (!(await this.exists(dni))) {
            throw new Error(`El afiliado con DNI ${dni} no existe.`);
        }

        // Actualizar el afiliado
        await this.repo.update(dni, data);
    }

    // Métodos de eliminación
    async delete(dni) {
        const familyGroup = await this.repo.getFamilyGroupNumber(dni);
        if (!familyGroup) {
            throw new Error(`No se encontró grupo familiar para el DNI ${dni}`);
        }

        const dniList = await this.getFamilyGroupDniList(familyGroup.idGrupoFamiliarFK);
        await this.deleteAffiliateAndRelatedData(dniList);
    }

    async getFamilyGroupDniList(familyGroupId) {
        const familyMembers = await this.repo.getDniOfTheFamilyGroup(familyGroupId);
        return familyMembers.map(f => f.dni);
    }

    async deleteAffiliateAndRelatedData(dniList) {
        await this.repo.delete(dniList);
        await Promise.allSettled([
            this.emailServ.delete(dniList),
            this.telService.delete(dniList),
            this.affiliateSituation.delete(dniList)
        ]);
    }

    // Métodos auxiliares para extraer datos
    getEmails(emailList) {
        return emailList.map(e => e.email);
    }

    getTelephones(telephoneList) {
        return telephoneList.map(t => t.telefono);
    }

    getSituations(situationList) {
        return situationList.map(s => s);
    }

    async exists(dni) {
        return await this.repo.exists(dni);
    }
}

module.exports = AffiliateService;
