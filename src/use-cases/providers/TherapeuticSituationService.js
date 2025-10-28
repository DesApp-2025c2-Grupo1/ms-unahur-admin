class TherapeuticSituationService {
    constructor(repository) {
        this.repository = repository;
    }

    async findAll() {
        return await this.repository.findAll();
    }

    async findById(id) {
        if (!id) {
            throw new Error("Se requiere el ID de la situación terapéutica");
        }
        return await this.repository.findById(id);
    }
}

module.exports = TherapeuticSituationService;
