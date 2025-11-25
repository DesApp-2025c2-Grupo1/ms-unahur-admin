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
            console.error('AgendaController.findAll error:', error);
            return res.status(500).json({ error: error.message });
        }
    }

    async findById(req, res) {
        try {
            const { id } = req.params;
            const agenda = await this.service.findById(id);
            return res.status(200).json(agenda);
        } catch (error) {
            console.error('AgendaController.findById error:', error);
            const status = error.message.includes('no encontrada') ? 404 : 500;
            return res.status(status).json({ error: error.message });
        }
    }

    async create(req, res) {
        try {
            const payload = req.body;
            console.log('[AgendaController.create] Payload recibido:', JSON.stringify(payload, null, 2));
            
            const created = await this.service.create(payload);
            console.log('[AgendaController.create] ✅ Agenda creada:', created);
            
            return res.status(201).json(created);
        } catch (error) {
            console.error('[AgendaController.create] ❌ Error:', error.message);
            return res.status(400).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const payload = req.body;
            console.log(`[AgendaController.update] Actualizando agenda ${id}:`, JSON.stringify(payload, null, 2));
            
            const updated = await this.service.update(id, payload);
            console.log(`[AgendaController.update] ✅ Agenda actualizada:`, updated);
            
            return res.status(200).json(updated);
        } catch (error) {
            console.error(`[AgendaController.update] ❌ Error:`, error.message);
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
            console.error('AgendaController.delete error:', error);
            const status = error.message.includes('no encontrada') ? 404 : 400;
            return res.status(status).json({ error: error.message });
        }
    }
}

module.exports = AgendaController;