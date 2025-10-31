const TherapeuticSituationMapper = require('./TherapeuticSituationMapper');

class SituacionAfiliadoMapper {
    constructor() {
        this.tMapper = new TherapeuticSituationMapper();
    }

    map(data) {
        if (!data) return null;

        return {
            idSituacionAfiliado: data.idSituacionAfiliado,
            fechaInicio: data.fechaInicio,
            fechaFin: data.fechaFin,
            situacion: this.tMapper.map(data.situacionTerapeutica)
        };
    }
}

module.exports = SituacionAfiliadoMapper;
