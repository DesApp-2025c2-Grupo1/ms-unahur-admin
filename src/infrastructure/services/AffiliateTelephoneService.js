const AffiliateTelephoneRepository = require('@repositories/AffiliateTelephoneRepository');

class AffiliateTelephoneService {
    constructor(repo = new AffiliateTelephoneRepository()) {
        this.repo = repo
    }
    async delete(dnis) {
        await this.repo.delete(dnis);
    }
    async deleteTelephone(dni, telephone) {
        await this.repo.deleteTelephone(dni, telephone);
    }
}
module.exports = AffiliateTelephoneService;