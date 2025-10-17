const Affiliate = require("../domain/entities/Affiliate");

class AffiliateMapper {
    mapToEntity(data) {
        if (!data) return null;

        return new Affiliate({
            dni: data.dni,                               // dni
            grupoFamiliarId: data.familyGroupId,        // familyGroupId
            numeroMiembro: data.memberNumber,           // memberNumber
            credencial: data.credential,                // credential
            tipoDocumento: data.documentType,           // documentType
            nombre: data.firstName,                      // firstName
            apellido: data.lastName,                     // lastName
            fechaNacimiento: data.birthDate ? this.formatDate(data.birthDate) : null,  // birthDate
            parentesco: data.relationship,              // relationship
            validoDesde: data.validFrom ? this.formatDate(data.validFrom) : null,      // validFrom
            validoHasta: data.validUntil ? this.formatDate(data.validUntil) : null,   // validUntil
            nombrePlan: data.planname || null,          // planName
            situacionesTerapeuticas: data.therapeuticsituationnames || [] // therapeuticSituations
        });
    }

    formatDate(date) {
        const parsed = new Date(date);
        return isNaN(parsed) ? null : parsed.toLocaleDateString();
    }
}

module.exports = AffiliateMapper;
