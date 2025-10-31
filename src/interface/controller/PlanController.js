const PlanService = require('../../infrastructure/services/PlanService');
const PlanMapper = require('./mapper/response/PlanMapper')

const service = new PlanService();
const mapper = new PlanMapper();

class PlanController {

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