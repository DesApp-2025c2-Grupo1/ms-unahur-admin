class AgendaController {
    constructor(service) {
        this.service = service;
        this.findAll = this.findAll.bind(this);
        this.findById = this.findById.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    async findAll(req, res) {
        try {
            const filters = {};

            // Filtros opcionales desde query params
            if (req.query.cuitCuil) {
                filters.cuitCuil = req.query.cuitCuil;
            }

            if (req.query.idEspecialidad) {
                filters.idEspecialidad = req.query.idEspecialidad;
            }

            const agendas = await this.service.findAll(filters);
            return res.status(200).json(agendas);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async findById(req, res) {
        try {
            const { id } = req.params;
            const agenda = await this.service.findById(id);
            return res.status(200).json(agenda);
        } catch (error) {
            const status = error.message.includes('no encontrada') ? 404 : 500;
            return res.status(status).json({ error: error.message });
        }
    }

    async create(req, res) {
        try {
            const payload = req.body;

            const created = await this.service.create(payload);

            return res.status(201).json(created);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const payload = req.body;

            const updated = await this.service.update(id, payload);

            return res.status(200).json(updated);
        } catch (error) {
            const status = error.message.includes('no encontrada') ? 404 : 400;
            return res.status(status).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const result = await this.service.delete(id);
            return res.status(200).json(result);
        } catch (error) {
            const status = error.message.includes('no encontrada') ? 404 : 400;
            return res.status(status).json({ error: error.message });
        }
    }
}

module.exports = AgendaController;