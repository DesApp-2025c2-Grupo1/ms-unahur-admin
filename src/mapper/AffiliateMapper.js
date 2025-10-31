const Affiliate = require("../domain/entities/Affiliate");

class AffiliateMapper {
    map(data) {
        if (!data) return null;
        return new Affiliate({
            idGrupoFamiliarFK: data.idGrupoFamiliarFK,
            tipoDocumento: data.tipoDocumento,
            apellido: data.apellido,
            credencial: data.credencial,
            direccion: data.direccion,
            dni: data.dni,
            email: data.email,
            nombre: data.nombre,
            parentesco: data.parentesco,
            telefono: data.telefono,
            plan: data.grupoFamiliar?.plan?.nombre
        });
    }
    mapList(data) {
        if (!Array.isArray(data)) return [];
        return data.map(x => this.map(x));
    }
}

module.exports = AffiliateMapper;
