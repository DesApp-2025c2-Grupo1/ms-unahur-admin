class ProviderController {
    constructor(service) {
        this.service = service;
        this.findAll = this.findAll.bind(this);
        this.findByCuitCuil = this.findByCuitCuil.bind(this);
        this.checkAgendasBySpecialty = this.checkAgendasBySpecialty.bind(this);
        this.checkAgendasByPlaces = this.checkAgendasByPlaces.bind(this);
    }


    async findAll(req, res) {
        try {
            const providers = await this.service.findAll();
            return res.status(200).json(providers);
        } catch (error) {
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
            return res.status(500).json({ error: error.message });
        }
    }

    async create(req, res) {
        try {
            const payload = req.body;
            const created = await this.service.create(payload);
            return res.status(201).json({ message: 'Prestador creado correctamente', data: created });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const { cuit } = req.params;
            const payload = req.body;
            const updated = await this.service.update(cuit, payload);
            return res.status(200).json({ message: 'Prestador actualizado correctamente', data: updated });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    async checkAgendasBySpecialty(req, res) {
        try {
            const { cuit } = req.params;
            const { specialtyId } = req.query;

            if (!specialtyId) {
                return res.status(400).json({
                    error: 'Se requiere el parámetro specialtyId'
                });
            }

            const agendas = await this.service.checkAgendasBySpecialty(cuit, specialtyId);
            return res.status(200).json({ agendas, count: agendas.length });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async checkAgendasByPlaces(req, res) {
        try {
            const { cuit } = req.params;

            const agendas = await this.service.checkAgendasByPlaces(cuit);
            return res.status(200).json({ agendas, count: agendas.length });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }



    async delete(req, res) {
        try {
            const { cuit } = req.params;
            const result = await this.service.delete(cuit);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}

module.exports = ProviderController;
