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
            plan: data.grupoFamiliar?.plan?.nombre,
            fecha_nacimiento: formatDate(data.fecha_nacimiento)
        });
    }
}

function formatDate(date) {
    if (!date) return null;
    const d = new Date(date);
    d.formattedDate = d.getDate().toString().padStart(2, '0') + '-' +
        (d.getMonth() + 1).toString().padStart(2, '0') + '-' +
        d.getFullYear();
    return d.formattedDate;
}

module.exports = AffiliateMapper;
