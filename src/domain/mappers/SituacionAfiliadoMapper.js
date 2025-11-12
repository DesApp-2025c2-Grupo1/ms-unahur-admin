const TherapeuticSituationMapper = require('./TherapeuticSituationMapper');

class SituacionAfiliadoMapper {
    constructor(mapper = new TherapeuticSituationMapper()) {
        this.mapper = mapper;
    }

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
        return {
            idSituacionAfiliado: data.idSituacionAfiliado,
            idSituacion: data.idSituacionFK,
            fechaInicio: this.formatDate(data.fechaInicio),
            fechaFin: data.fechaFin ? this.formatDate(data.fechaFin) : null,
            situacionTerapeutica: this.mapper.map(data.situacionTerapeutica)
        };
    }

    mapList(data) {
        if (!Array.isArray(data)) return [];
        return data.map(x => this.map(x));
    }
}

module.exports = SituacionAfiliadoMapper;