const AffiliateEmailRepository = require('@repositories/AffiliateEmailRepository');

class AffiliateEmailService {
    constructor(repo = new AffiliateEmailRepository()) {
        this.repo = repo;
    }
    async delete(dnis) {
        await this.repo.delete(dnis);
    }
    async deleteEmail(dni, email) {
        console.log(dni)
        console.log(email)
        await this.repo.deleteEmail(dni, email);
    }
}
module.exports = AffiliateEmailService;