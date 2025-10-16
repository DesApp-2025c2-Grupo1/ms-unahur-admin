const Affiliate = require("../domain/entities/Affiliate");

class AffiliateMapper {
    constructor() { }

    mapToEntity(data) {
        if (!data) return null;

        return new Affiliate({
            dni: data.dni,
            idGrupoFamiliar: data.familyGroupId,
            numeroMiembro: data.memberNumber,
            credencial: data.credential,
            tipoDocumento: data.documentType,
            nombre: data.firstName,
            apellido: data.lastName,
            fechaNacimiento: data.birthDate.toLocaleDateString(),
            parentesco: data.relationship,
            validoDesde: data.validFrom.toLocaleDateString(),
            plan:data.planname,
            validoHasta: data.validUntil,
            situaciones: data.therapeuticsituationnames
            // grupoFamiliar = null,
            // situaciones
        });
    }

}

module.exports = AffiliateMapper;