const TherapeuticSituationRepository = require('@repositories/TherapeuticSituationRepository');

class TherapeuticSituationService {
    constructor(repo = new TherapeuticSituationRepository()) {
        this.repo = repo;
    }

    async findAll() {
        return await this.repo.findAll();
    }

    async findById(id) {
        return await this.repo.findById(id);
    }
}

module.exports = TherapeuticSituationService;