const { Affiliate } = require('../entities/main');
const EmailMapper = require('./EmailMapper');
const PlanMapper = require('./PlanMapper');
const TelephoneMapper = require('./TelephoneMapper');
const SituacionAfiliadoMapper = require('./SituacionAfiliadoMapper');

const emailMapper = new EmailMapper();
const planMapper = new PlanMapper();
const telephoneMapper = new TelephoneMapper();
const situacionAfiliadoMapper = new SituacionAfiliadoMapper();

class AffiliateMapper {
    formatDate(date) {
        if (!date) return null;
        
        // Crear la fecha interpretándola como hora local, no UTC
        const d = new Date(date);
        
        // Usar getUTCDate para obtener el día en UTC (como está guardado en la BD)
        const day = String(d.getUTCDate()).padStart(2, '0');
        const month = String(d.getUTCMonth() + 1).padStart(2, '0');
        const year = d.getUTCFullYear();
        
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
            email: emailMapper.mapList(data.emails),
            nombre: data.nombre,
            fecha_nacimiento: this.formatDate(data.fecha_nacimiento),
            parentesco: data.parentesco,
            telefonos: telephoneMapper.mapList(data.telefonos),
            plan: planMapper.map(data.grupoFamiliar?.plan),
            situaciones: situacionAfiliadoMapper.mapList(data.situaciones)
        });
    }

    mapList(data) {
        if (!Array.isArray(data)) return [];
        return data.map(x => this.map(x));
    }
}

module.exports = AffiliateMapper;
