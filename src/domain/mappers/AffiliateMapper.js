const { Affiliate } = require('../entities/main')
const EmailMapper = require('./EmailMapper');
const PlanMapper = require('./PlanMapper');

const mapper = new EmailMapper();
const planMapper = new PlanMapper();

class AffiliateMapper {
    map(data) {
        if (!data) return null;
        return new Affiliate(
            {
                grupoFamiliar: data.idGrupoFamiliarFK,
                tipoDocumento: data.tipoDocumento,
                apellido: data.apellido,
                credencial: data.credencial,
                direccion: data.direccion,
                dni: data.dni,
                email: mapper.mapList(data.emails),
                nombre: data.nombre,
                parentesco: data.parentesco,
                telefono: data.telefono,
                plan: planMapper.map(data.grupoFamiliar.plan)
            }
        );
    }
    mapList(data) {
        if (!Array.isArray(data)) return [];
        return data.map(x => this.map(x));
    }
}

module.exports = AffiliateMapper;
