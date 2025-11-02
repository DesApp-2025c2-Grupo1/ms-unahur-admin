const AffiliateEmailRepository = require('@repositories/AffiliateEmailRepository');

class AffiliateEmailService {
    constructor(repo = new AffiliateEmailRepository()) {
        this.repo = repo;
    }
    async delete(dnis) {
        await this.repo.delete(dnis);
    }
}
module.exports = AffiliateEmailService;