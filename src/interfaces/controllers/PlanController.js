const PlanService = require('@services/PlanService')
const PlanMapper = require('@mappers/PlanMapper');

class PlanController {
    constructor(service = new PlanService(), mapper = new PlanMapper()) {
        this.service = service;
        this.mapper = mapper;
    }
    async findAll(req, res) {
        try {
            const plans = service.findAll();
            res.status(200).json({ plans: mapper.mapList(plans) })
        } catch (err) {
            res.status(500).json(err)
        }
    }

}

module.exports = PlanController;