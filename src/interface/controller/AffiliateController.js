const AffiliateService = require('@services/AffiliateService')
const AffiliateMapper = require('@mappers/AffiliateMapper');

const service = new AffiliateService();
const mapper = new AffiliateMapper();

class AffiliateController {

    async findAll(req, res) {
        try {
            const affiliates = await service.findAll();
            res.status(200).json({ affiliates: mapper.mapList(affiliates) })
        } catch (err) {
            console.log(err)
            res.status(500).json(err)
        }
    }

    async delete(req, res) {
        try {
            const { dni } = req.params;
            await service.delete(dni)
            res.status(200).json()
        } catch (err) {
            console.log(err)
            res.status(500).json(err)
        }
    }


}

module.exports = AffiliateController;
