class TherapeuticSituationController {
    constructor(service) {
        this.service = service;
    }

    async findAll(req, res) {
        try {
            const situaciones = await this.service.findAll();
            res.status(200).json({ situaciones });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async findById(req, res) {
        try {
            const { id } = req.params;
            const situacion = await this.service.findById(id);

            if (!situacion) {
                return res.status(404).json({ error: "Situación terapéutica no encontrada" });
            }

            res.status(200).json(situacion);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = TherapeuticSituationController;
