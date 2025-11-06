const SpecialtyRepository = require('../../infrastructure/repositories/SpecialtyRepository');

class SpecialtyService {
    constructor() {
        this.repo = new SpecialtyRepository();
    }

    async findAll() {
        return await this.repo.findAll();
    }

    async findById(id) {
        return await this.repo.findById(id);
    }
}

module.exports = SpecialtyService;
