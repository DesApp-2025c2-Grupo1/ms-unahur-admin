class PlanController {
    constructor(planService) {
        this.planService = planService;
    }
    async findAll(req, res) {
        const plans = await this.planService.findAll()
        res.status(200).json({ plans });
    }
}

module.exports = PlanController;