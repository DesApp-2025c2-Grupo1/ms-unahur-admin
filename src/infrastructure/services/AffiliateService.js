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

    // Listar afiliados pendientes (fecha_alta futura)
    findPending() {
        return this.repo.findPending();
    }

    async getAffiliateByDni(dni) {
        const affiliate = await this.repo.getAffiliateByDni(dni);
        return affiliate;
    }

    // Crear afiliado principal y sus familiares
    async createAffiliate(affiliate) {
        if (await this.exists(affiliate.dni)) {
            throw new Error(`El afiliado con DNI ${affiliate.dni} ya existe.`);
        }

        // Crear titular
        const holder = await this.createHolder(affiliate);
        const baseCredencial = holder.credencial.split('-')[0];
        const familyGroupId = holder.grupoFamiliar.idGrupoFamiliar; // Guarda el grupo familiar del titular
        const dateHigh = holder.fecha_alta;

        // Crear familiares si existen
        if (affiliate.familiares?.length > 0) {
            for (const [index, fam] of affiliate.familiares.entries()) {
                await this.createFamilyMember(fam, baseCredencial, index, affiliate.plan, familyGroupId, dateHigh);
            }
        }

        return holder;
    }

    // Modificar afiliado
    async updateAffiliate(dni, data) {
        const updated = await this.repo.update(dni, data);
        return updated;
    }



    // Crear el titular
    async createHolder(holderData) {
        const emails = this.getEmails(holderData.emails);
        const situations = this.getSituations(holderData.situaciones);
        const telephones = this.getTelephones(holderData.telefonos);

        const nextFamilyNumber = await this.repo.getNextCredentialNumber();
        const baseCredencial = `${nextFamilyNumber.toString().padStart(7, '0')}-01`;

        return await this.repo.create(holderData, baseCredencial, emails, telephones, situations, holderData.plan, null, holderData.fecha_alta);
    }

    // Crear un familiar
    async createFamilyMember(familyData, baseCredencial, index, plan, familyGroupId, dateHigh) {
        const emails = this.getEmails(familyData.emails);
        const situations = this.getSituations(familyData.situaciones);
        const telephones = this.getTelephones(familyData.telefonos);

        const credencialFamiliar = `${baseCredencial}-${(index + 2).toString().padStart(2, '0')}`;

        return await this.repo.create(
            { ...familyData, parentesco: familyData.parentesco || 'Familiar' },
            credencialFamiliar,
            emails,
            telephones,
            situations,
            plan,
            familyGroupId,
            null //Sin fecha_alta programada - se crea activo inmediatamente
        );

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

    async deleteFamilyMember(dni) {
        const affiliate = await this.repo.getAffiliateByDni(dni);
        if (!affiliate) {
            throw new Error(`No se encontró el afiliado con DNI ${dni}`);
        }

        if (!affiliate.idGrupoFamiliarFK) {
            throw new Error(`El afiliado con DNI ${dni} no pertenece a ningún grupo familiar`);
        }

        await this.deleteAffiliateAndRelatedData([dni]);

        return { message: `Afiliado ${affiliate.nombre} ${affiliate.apellido} eliminado correctamente` };
    }

    async getFamilyGroup(dni) {
        const familyGroup = await this.repo.getFamilyGroupNumber(dni);
        const familyMembers = await this.repo.getFamily(familyGroup.idGrupoFamiliarFK);
        return familyMembers;
    }

    // Agregar familiar a un grupo existente
    async addFamilyMember(dniTitular, familyData) {
        // Obtener el grupo familiar del titular
        const titular = await this.repo.getFamilyGroupNumber(dniTitular);
        if (!titular || !titular.idGrupoFamiliarFK) {
            throw new Error(`No se encontró el grupo familiar para el titular con DNI ${dniTitular}`);
        }

        const familyGroupId = titular.idGrupoFamiliarFK;

        // Verificar que el familiar no exista ya
        if (await this.exists(familyData.dni)) {
            throw new Error(`El afiliado con DNI ${familyData.dni} ya existe.`);
        }

        // Obtener los miembros actuales para calcular el siguiente número de credencial
        const currentMembers = await this.repo.getFamily(familyGroupId);
        const nextMemberNumber = currentMembers.length + 1;

        // Obtener la credencial base del grupo (primeros 7 dígitos)
        const titularAffiliate = currentMembers.find(m => m.parentesco === 'Titular');
        if (!titularAffiliate) {
            throw new Error('No se encontró el titular del grupo familiar');
        }
        const baseCredencial = titularAffiliate.credencial.split('-')[0];

        // Generar la credencial del nuevo familiar
        const credencialFamiliar = `${baseCredencial}-${nextMemberNumber.toString().padStart(2, '0')}`;

        // Procesar emails, teléfonos y situaciones
        const emails = this.getEmails(familyData.emails);
        const situations = this.getSituations(familyData.situaciones);
        const telephones = this.getTelephones(familyData.telefonos);


        // Crear el familiar
        return await this.repo.create(
            { ...familyData, parentesco: familyData.parentesco || 'Familiar' },
            credencialFamiliar,
            emails,
            telephones,
            situations,
            familyData.plan,
            familyGroupId,
            null // sin fecha de alta programada
        );
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

    async deleteEmail(dni, email) {
        await this.emailServ.deleteEmail(dni, email)
    }

    async deleteTelephone(dni, telephone) {
        await this.telService.deleteTelephone(dni, telephone)
    }

    async exists(dni) {
        return await this.repo.exists(dni);
    }

}

module.exports = AffiliateService;
