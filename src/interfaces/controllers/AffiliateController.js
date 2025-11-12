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

    async getAffiliateByDni(req, res) {
        try {
            const { dni } = req.params;
            const affiliate = await this.service.getAffiliateByDni(dni);
            return res.status(200).json({
                affiliates: this.mapper.map(affiliate)
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
        
        console.log("Controller - DNI:", dni);
        console.log("Controller - Datos recibidos:", JSON.stringify(data, null, 2));
        
        const updated = await this.service.updateAffiliate(dni, data);
        
        console.log("Controller - Actualización exitosa");
        
        return res.status(200).json({
            affiliate: this.mapper.map(updated)
        });
    } catch (error) {
        console.error("Controller - Error:", error);
        return res.status(500).json({
            error: error.message || 'Error al editar el afiliado'
        });
    }
}



    async delete(req, res) {
        try {
            const { dni } = req.params;
            await this.service.delete(dni);
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({
                error: error.message || 'Error al eliminar el afiliado'
            });
        }
    }

    async deleteEmail(req, res) {
        try {
            const { dni } = req.params;
            const { email } = req.body;
            await this.service.deleteEmail(dni, email);
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({
                error: error.message || 'Error al eliminar el afiliado'
            });
        }
    }

    async deleteTelephone(req, res) {
        try {
            const { dni } = req.params;
            const { telephone } = req.body;
            await this.service.deleteTelephone(dni, telephone);
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({
                error: error.message || 'Error al eliminar el afiliado'
            });
        }
    }

    async getFamilyGroup(req, res) {
        try {
            const { dni } = req.params;
            const familyGroup = await this.service.getFamilyGroup(dni);
            return res.status(200).json({
                affiliates: this.mapper.mapList(familyGroup)
            });
        } catch (error) {
            return res.status(500).json({
                error: error.message || 'Error al obtener el grupo familiar'
            });
        }
    }

    async updatePlan(req, res) {
        try {
            const { dni } = req.params;
            const { idPlan } = req.body;

            await this.service.updateAffiliatePlan(dni, idPlan);

            return res.status(200).json({
                message: "Plan actualizado correctamente"
            });
        } catch (error) {
            return res.status(500).json({
                error: error.message || 'Error al actualizar el plan'
            });
        }
    }
}

module.exports = AffiliateController;
