const AffiliateRepository2 = require('../repositories/AffiliateRepository2')

const repository = new AffiliateRepository2();

class AffiliateService {

    async findAll() {
        const affiliates = await repository.findAll();
        return affiliates;
    }
}

module.exports = AffiliateService;
