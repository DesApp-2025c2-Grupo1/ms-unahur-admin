const { error } = require("console");

class ProviderController {
    constructor(providerService) {
        this.providerService = providerService;
    }

    async list(req, res) {
        try {
            const providers = await this.providerService.listProviders();
            res.status(200).json(providers);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async create(req, res) {
        try {
            const provider = await this.providerService.createProvider(req.body);
            res.status(201).json(provider);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async delete(req, res) {
        try {
            const deleted = await this.providerService.delete(req.params);
            res.status(200).json({ message: "Afiliado eliminado correctamente", deleted });
        } catch (err) {
            res.status(404).json({ error: err.message })
        }
    }

    async listFamilyGroup(req, res) {
        try {
            const providers = await this.providerService.listFamilyGroup(req.params);
            res.status(200).json(providers);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = ProviderController;
