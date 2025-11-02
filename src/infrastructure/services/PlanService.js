const PlanRepository = require('../repositories/PlanRepository');
const repository = new PlanRepository()

class PlanService {

    async findAll() {
        const plans = repository.findAll();
        return plans
    }

}

module.exports = PlanService;