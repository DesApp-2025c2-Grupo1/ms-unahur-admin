const TherapeuticSituation = require("../entities/TherapeuticSituation");

class TherapeuticSituationMapper {
    map(data) {
        if (!data) return null;

        return new TherapeuticSituation({
            idSituacion: data.idSituacion,
            nombre: data.nombre
        });
    }
    mapList(data) {
        if (!Array.isArray(data)) return [];
        return data.map(x => this.map(x));
    }
}

module.exports = TherapeuticSituationMapper;
