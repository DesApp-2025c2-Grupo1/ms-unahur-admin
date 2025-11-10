const TherapeuticSituationMapper = require('./TherapeuticSituationMapper');

class SituacionAfiliadoMapper {
    constructor(mapper = new TherapeuticSituationMapper()) {
        this.mapper = mapper;
    }

    map(data) {
        if (!data) return null;
        return {
            idSituacionAfiliado: data.idSituacionAfiliado,
            fechaInicio: data.fechaInicio,
            fechaFin: data.fechaFin,
            situacionTerapeutica: this.mapper.map(data.situacionTerapeutica) 
        };
    }

    mapList(data) {
        if (!Array.isArray(data)) return [];
        return data.map(x => this.map(x));
    }
}

module.exports = SituacionAfiliadoMapper;
