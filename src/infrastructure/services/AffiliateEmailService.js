const AffiliateEmailRepository = require('../repositories/AffiliateEmailRepository');

const repository = new AffiliateEmailRepository()

class AffiliateEmailService {
    async delete(dnis) {
        await repository.delete(dnis);
    }
}
module.exports = AffiliateEmailService;