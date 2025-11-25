class AgendaMapper {
    map(db) {
        if (!db) return null;

        // Orden de días de la semana
        const order = { 
            Lunes: 1, 
            Martes: 2, 
            Miercoles: 3, 
            Jueves: 4, 
            Viernes: 5, 
            Sabado: 6, 
            Domingo: 7 
        };

        // Agrupar bloques por rango horario (horaDesde-horaHasta)
        const bloquesRaw = Array.isArray(db.bloques) ? db.bloques : [];
        const grouped = {};

        for (const bloque of bloquesRaw) {
            if (!bloque || !bloque.horaDesde || !bloque.horaHasta) continue;
            
            const key = `${bloque.horaDesde}::${bloque.horaHasta}`;
            if (!grouped[key]) {
                grouped[key] = {
                    desde: bloque.horaDesde,
                    hasta: bloque.horaHasta,
                    diasSet: new Set()
                };
            }
            if (bloque.diaSemana) {
                grouped[key].diasSet.add(bloque.diaSemana);
            }
        }

        // Convertir a array de bloques con días ordenados
        const bloques = Object.values(grouped).map(g => ({
            dias: Array.from(g.diasSet).sort((a, b) => (order[a] || 0) - (order[b] || 0)),
            desde: g.desde,
            hasta: g.hasta,
        }));

        // Formatear días para mostrar (ej: "Lun - Vie" o lista de días)
        const allDias = Array.from(
            new Set(bloquesRaw.map(b => b.diaSemana).filter(Boolean))
        ).sort((a, b) => (order[a] || 0) - (order[b] || 0));

        const diasAbreviados = {
            Lunes: "Lun",
            Martes: "Mar",
            Miercoles: "Mié",
            Jueves: "Jue",
            Viernes: "Vie",
            Sabado: "Sáb",
            Domingo: "Dom"
        };

        const diasDisplay = allDias.map(d => diasAbreviados[d] || d);

        // Formatear horario completo
        const horarioDisplay = bloques.length > 0 
            ? bloques.map(b => `${b.desde} - ${b.hasta}`).join(" / ")
            : "Sin horarios";

        // Formatear lugar
        const lugarDisplay = db.lugar 
            ? `${db.lugar.direccion || ''}, ${db.lugar.localidad || ''}`.trim().replace(/^,\s*/, '').replace(/,\s*$/, '')
            : "Sin lugar";

        return {
            id: db.idAgenda.toString(),
            prestador: db.prestador?.nombreCompleto || "Sin prestador",
            cuitCuil: db.prestador?.cuitCuil || "",
            tipoPrestador: db.prestador?.tipoPrestador || "",
            especialidad: db.especialidad?.nombre || "Sin especialidad",
            idEspecialidad: db.especialidad?.idEspecialidad || null,
            lugar: lugarDisplay,
            idLugar: db.lugar?.idLugar || null,
            lugarCompleto: db.lugar ? {
                idLugar: db.lugar.idLugar,
                direccion: db.lugar.direccion || "",
                localidad: db.lugar.localidad || "",
                provincia: db.lugar.provincia || "",
                codigoPostal: db.lugar.codigoPostal || ""
            } : null,
            dias: diasDisplay,
            diasCompletos: allDias,
            horario: horarioDisplay,
            bloques: bloques,
            duracion: db.duracionTurno || 0,
            fechaInicio: db.fechaInicio,
            fechaFin: db.fechaFin,
            estaActivo: db.esta_activo !== false
        };
    }
}

module.exports = AgendaMapper;