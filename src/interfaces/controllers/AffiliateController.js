const AffiliateService = require('@services/AffiliateService');
const AffiliateMapper = require('@mappers/AffiliateMapper');

class AffiliateController {
    constructor(service = new AffiliateService(), mapper = new AffiliateMapper()) {
        this.service = service;
        this.mapper = mapper;
    }

    async findAll(req, res) {
        try {
            const affiliates = await this.service.findAll();
            return res.status(200).json({
                affiliates: this.mapper.mapList(affiliates)
            });
        } catch (error) {
            return res.status(500).json({
                error: error.message || 'Error interno del servidor'
            });
        }
    }

    async create(req, res) {
        try {
            const affiliate = req.body;
            await this.service.createAffiliate(affiliate);
            return res.status(201).json({
                message: "Afiliado creado exitosamente"
            });
        } catch (error) {
            return res.status(404).json({
                error: error.message || 'Error al crear el afiliado'
            });
        }
    }

    async update(req, res) {
        try {
            const { dni } = req.params;
            const data = req.body;

            // Llamar al servicio para actualizar el afiliado
            await this.service.updateAffiliate(dni, data);

            // Responder con éxito sin contenido
            return res.status(204).send();
        } catch (error) {
            // Manejo de errores
            return res.status(500).json({
                error: error.message || 'Error al editar el afiliado'
            });
        }
    }

    async delete(req, res) {
        try {
            const { dni } = req.params;
            await this.service.d(dni);
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({
                error: error.message || 'Error al eliminar el afiliado'
            });
        }
    }
}

module.exports = AffiliateController;
