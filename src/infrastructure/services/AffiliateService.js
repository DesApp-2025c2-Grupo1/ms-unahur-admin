const AffiliateRepository2 = require('../repositories/AffiliateRepository2')

const repository = new AffiliateRepository2();

class AffiliateService {

    async findAll() {
        const affiliates = repository.findAll();
        return affiliates;
    }

    async create(data) {
        const { familyGroup } = data; //grupo familiar
    }
}

module.exports = AffiliateService;
