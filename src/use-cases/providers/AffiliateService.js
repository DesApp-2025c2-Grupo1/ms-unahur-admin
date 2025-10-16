class ProviderService {
    constructor(providerRepository) {
        this.providerRepository = providerRepository;
    }

    async createProvider(data) {
        const provider = await this.providerRepository.create(data);
        return provider;
    }

    async listProviders() {
        return await this.providerRepository.findAll();
    }

    async delete(data) {
        await this.providerRepository.delete(data);
    }

    async listFamilyGroup(data){
        return await this.providerRepository.listFamilyGroup(data);
    }

}

module.exports = ProviderService;