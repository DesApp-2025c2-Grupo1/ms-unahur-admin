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

    async create(payload) {
        // Basic business validation could go here (e.g., check duplicates)
        const exists = await this.providerRepository.findByCuitCuil(payload.cuitCuil).catch(() => null);
        if (exists) throw new Error('El prestador ya existe');
        return await this.providerRepository.create(payload);
    }

    async checkAgendasBySpecialty(cuitCuil, specialtyId) {
        try {
            return await this.providerRepository.checkAgendasBySpecialty(cuitCuil, specialtyId);
        } catch (error) {
            throw error;
        }
    }

    async checkAgendasByPlaces(cuitCuil) {
        try {
            return await this.providerRepository.checkAgendasByPlaces(cuitCuil);
        } catch (error) {
            throw error;
        }
    }


    async update(cuitCuil, payload) {
        // Could validate conflicts (e.g., changing cuit to existing) here
        try {
            const result = await this.providerRepository.updateByCuitCuil(cuitCuil, payload);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async delete(cuitCuil) {
        return await this.providerRepository.deleteByCuitCuil(cuitCuil);
    }
}

module.exports = ProviderService;
