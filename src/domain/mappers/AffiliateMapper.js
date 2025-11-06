const { Affiliate } = require('../entities/main');
const EmailMapper = require('./EmailMapper');
const PlanMapper = require('./PlanMapper');
const Telephone = require('./TelephoneMapper');

const mapper = new EmailMapper();
const planMapper = new PlanMapper();
const telephoneMapper = new Telephone();

class AffiliateMapper {
    formatDate(date) {
        if (!date) return null;
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    }

    map(data) {
        if (!data) return null;
        return new Affiliate({
            grupoFamiliar: data.idGrupoFamiliarFK,
            tipoDocumento: data.tipoDocumento,
            apellido: data.apellido,
            credencial: data.credencial,
            direccion: data.direccion,
            dni: data.dni,
            email: mapper.mapList(data.emails),
            nombre: data.nombre,
            fecha_nacimiento: this.formatDate(data.fecha_nacimiento),
            parentesco: data.parentesco,
            telefonos: telephoneMapper.mapList(data.telefonos),
            plan: planMapper.map(data.grupoFamiliar?.plan)
        });
    }

    mapList(data) {
        if (!Array.isArray(data)) return [];
        return data.map(x => this.map(x));
    }
}

module.exports = AffiliateMapper;
