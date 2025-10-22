const TherapeuticSituation = require("../domain/entities/TherapeuticSituation");

class TherapeuticSituationMapper {
    map(data) {
        if (!data) return null;

        return new TherapeuticSituation({
            idSituacion: data.idSituacion,
            nombre: data.nombre
        });
    }
}

module.exports = TherapeuticSituationMapper;
