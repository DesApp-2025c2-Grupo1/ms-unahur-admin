const { Plan } = require('../entities/main')

class PlanMapper {
    map(data) {
        if (!data) return null;
        return new Plan(
            {
                idPlan: data.idPlan,
                nombre: data.nombre
            }
        )
    }
    mapList(data) {
        if (!Array.isArray(data)) return [];
        return data.map(x => this.map(x));
    }
}

module.exports = PlanMapper;
