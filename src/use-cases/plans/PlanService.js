class PlanService {
    constructor(planRepository) {
        this.planRepository = planRepository;
    }

    async findAll() {
        return await this.planRepository.findAll();
    }
}

module.exports = PlanService;