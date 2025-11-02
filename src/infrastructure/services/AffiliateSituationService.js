const AffiliateSituationRepository = require('@repositories/AffiliateSituationRepository');

class AffiliateSituationService {
    constructor(repo = new AffiliateSituationRepository()) {
        this.repo = repo
    }
    async delete(dnis) {
        await this.repo.delete(dnis);
    }
}
module.exports = AffiliateSituationService;