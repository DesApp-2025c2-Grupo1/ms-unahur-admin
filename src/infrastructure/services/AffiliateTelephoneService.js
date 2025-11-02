const AffiliateTelephoneRepository = require('@repositories/AffiliateEmailRepository');

class AffiliateEmailService {
    constructor(repo = new AffiliateTelephoneRepository()) {
        this.repo = repo
    }
    async delete(dnis) {
        await this.repo.delete(dnis);
    }
}
module.exports = AffiliateEmailService;