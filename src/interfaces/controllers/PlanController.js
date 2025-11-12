const PlanService = require('@services/PlanService');
const PlanMapper = require('@mappers/PlanMapper');

class PlanController {
    constructor(service = new PlanService(), mapper = new PlanMapper()) {
        this.service = service;
        this.mapper = mapper;
    }

    async findAll(req, res) {
        try {
            const plans = await this.service.findAll();
            res.status(200).json({ plans: this.mapper.mapList(plans) });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = PlanController;