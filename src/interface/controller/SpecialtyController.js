const SpecialtyService = require('../../use-cases/specialties/SpecialtyService');

const service = new SpecialtyService();

class SpecialtyController {
    async findAll(req, res) {
        try {
            const items = await service.findAll();
            return res.json(items);
        } catch (error) {
            console.error('SpecialtyController.findAll error:', error);
            return res.status(500).json({ error: 'Error al obtener las especialidades' });
        }
    }

    async findById(req, res) {
        try {
            const { id } = req.params;
            const item = await service.findById(id);
            if (!item) return res.status(404).json({ error: 'Especialidad no encontrada' });
            return res.json(item);
        } catch (error) {
            console.error('SpecialtyController.findById error:', error);
            return res.status(500).json({ error: 'Error al obtener la especialidad' });
        }
    }
}

module.exports = new SpecialtyController();
