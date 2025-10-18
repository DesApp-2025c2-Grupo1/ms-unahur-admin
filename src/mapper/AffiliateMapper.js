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
            telefono: data.telefono
        });
    }
}

module.exports = AffiliateMapper;
