class ProviderController {
    constructor(service) {
        this.service = service;
        this.findAll = this.findAll.bind(this);
        this.findByCuitCuil = this.findByCuitCuil.bind(this);
    }

    async findAll(req, res) {
        try {
            const providers = await this.service.findAll();
            return res.status(200).json(providers);
        } catch (error) {
            console.error('ProviderController.findAll error:', error);
            return res.status(500).json({ error: error.message });
        }
    }

    async findByCuitCuil(req, res) {
        try {
            const { cuit } = req.params;
            const provider = await this.service.findByCuitCuil(cuit);
            if (!provider) return res.status(404).json({ message: 'Prestador no encontrado' });
            return res.status(200).json(provider);
        } catch (error) {
            console.error('ProviderController.findByCuitCuil error:', error);
            return res.status(500).json({ error: error.message });
        }
    }

    async create(req, res) {
        try {
            const payload = req.body;
            const created = await this.service.create(payload);
            return res.status(201).json(created);
        } catch (error) {
            console.error('ProviderController.create error:', error);
            return res.status(400).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const { cuit } = req.params;
            const payload = req.body;
            const updated = await this.service.update(cuit, payload);
            return res.status(200).json(updated);
        } catch (error) {
            console.error('ProviderController.update error:', error);
            return res.status(400).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const { cuit } = req.params;
            const result = await this.service.delete(cuit);
            return res.status(200).json(result);
        } catch (error) {
            console.error('ProviderController.delete error:', error);
            return res.status(400).json({ error: error.message });
        }
    }
}

module.exports = ProviderController;
