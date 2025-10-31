const _ = require('lodash');


class ProviderMapper {
    map(db) {
        if (!db) return null;

        const lugar = db.lugarAtencion
            ? (() => {
                  const raw = db.lugarAtencion;

                  // Agrupar horarios por rango (horaDesde-horaHasta) y juntar dias
                  const horariosRaw = raw.horarios || [];
                  const grouped = {}; // key -> { desde, hasta, diasSet }

                  for (const h of horariosRaw) {
                      const key = `${h.horaDesde}::${h.horaHasta}`;
                      if (!grouped[key]) grouped[key] = { desde: h.horaDesde, hasta: h.horaHasta, diasSet: new Set() };
                      if (h.diaSemana) grouped[key].diasSet.add(h.diaSemana);
                  }

                  // Order for enum day names: Domingo(0) .. Sabado(6)
                  const order = { Domingo: 0, Lunes: 1, Martes: 2, Miercoles: 3, Jueves: 4, Viernes: 5, Sabado: 6 };

                  const horarios = Object.values(grouped).map(g => ({
                      dias: Array.from(g.diasSet).sort((a, b) => (order[a] || 0) - (order[b] || 0)),
                      desde: g.desde,
                      hasta: g.hasta,
                  }));

                  return {
                      idLugar: raw.idLugar,
                      direccion: raw.direccion,
                      localidad: raw.localidad,
                      provincia: raw.provincia,
                      codigoPostal: raw.codigoPostal,
                      horarios,
                  };
              })()
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
