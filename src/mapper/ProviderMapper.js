const _ = require('lodash');


class ProviderMapper {
    map(db) {
        if (!db) return null;

        const lugar = db.lugarAtencion
            ? {
                  idLugar: db.lugarAtencion.idLugar,
                  direccion: db.lugarAtencion.direccion,
                  localidad: db.lugarAtencion.localidad,
                  provincia: db.lugarAtencion.provincia,
                  codigoPostal: db.lugarAtencion.codigoPostal,
                  horarios: (db.lugarAtencion.horarios || []).map(h => ({
                      // keep enum name (e.g. 'Lunes', 'Martes') as requested
                      dias: h.diaSemana ? [h.diaSemana] : [],
                      desde: h.horaDesde,
                      hasta: h.horaHasta,
                      // no especialidad association in current HorarioAtencion model; keep optional placeholder
                      especialidadId: null,
                  })),
              }
            : null;

        return {
            cuitCuil: db.cuitCuil,
            nombreCompleto: db.nombreCompleto,
            tipoPrestador: db.tipoPrestador,
            centroMedicoId: db.centroMedicoId || null,
            lugarAtencion: lugar,
            telefonos: (db.telefonos || []).map(t => t.telefono),
            mails: (db.mails || []).map(m => m.mail),
            especialidades: (db.especialidades || []).map(pe => ({ idEspecialidad: pe.especialidad.idEspecialidad, nombre: pe.especialidad.nombre })),
            // agendas intentionally omitted for now
        };
    }
}

module.exports = ProviderMapper;
