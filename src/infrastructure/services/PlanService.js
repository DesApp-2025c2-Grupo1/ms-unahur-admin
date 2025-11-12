const PlanRepository = require('@repositories/PlanRepository');

class PlanService {
    constructor(repo = new PlanRepository()) {
        this.repo = repo;
    }

    async findAll() {
        return await this.repo.findAll();
    }
}

module.exports = PlanService;