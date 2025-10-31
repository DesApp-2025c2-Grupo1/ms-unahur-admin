class ProviderService {
    constructor(providerRepository) {
        this.providerRepository = providerRepository;
    }

    async findAll() {
        // Business rules / filtering can be added here later (paging, includes, query params)
        return await this.providerRepository.findAll();
    }

    async findByCuitCuil(cuitCuil) {
        return await this.providerRepository.findByCuitCuil(cuitCuil);
    }
}

module.exports = ProviderService;
