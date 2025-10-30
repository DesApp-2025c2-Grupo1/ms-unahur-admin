class AffiliateController {
    constructor(affiliateService) {
        this.affiliateService = affiliateService;
    }

    // Obtener todos los afiliados
    async findAll(req, res) {
        try {
            const affiliates = await this.affiliateService.findAll();
            res.status(200).json({ affiliates });
        } catch (err) {
            res.status(500).json();
        }
    }

    // Crear un nuevo afiliado
    async create(req, res) {
        try {
            const affiliate = await this.affiliateService.createAffiliate(req.body);
            return res.status(201).json({
                success: true,
                message: "Afiliado creado exitosamente",
                data: affiliate
            });
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: "Error al crear el afiliado",
                error: err.message
            });
        }
    }

    // Editar un afiliado
    async update(req, res) {
        try {
            const affiliate = await this.affiliateService.updateAffiliate(req.body);
            return res.status(201).json({
                success: true,
                message: "Afiliado creado exitosamente",
                data: affiliate
            });
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: "Error al crear el afiliado",
                error: err.message
            });
        }
    }

    // Obtener situaciones terapéuticas por DNI
    async getSituationsByDni(req, res) {
        try {
            const { dni } = req.params;

            if (!dni) {
                return res.status(400).json({
                    success: false,
                    message: "El DNI es requerido"
                });
            }

            const situaciones = await this.affiliateService.getTherapeuticSituationsByDni(dni);

            if (!situaciones) {
                return res.status(404).json({
                    success: false,
                    message: "Afiliado no encontrado"
                });
            }

            return res.status(200).json({
                success: true,
                data: situaciones
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "No se pudieron obtener las situaciones terapéuticas",
                error: err.message
            });
        }
    }

    // Eliminar afiliado por DNI
    async deleteByDni(req, res) {
        try {
            const { dni } = req.params;

            if (!dni) {
                return res.status(400).json({
                    success: false,
                    message: "El DNI es requerido"
                });
            }

            const result = await this.affiliateService.deleteAffiliate(dni);

            return res.status(200).json({
                success: true,
                message: "Afiliado eliminado correctamente",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: "Error al eliminar el afiliado",
                error: err.message
            });
        }
    }

    // Listar grupo familiar
    async listFamilyGroup(req, res) {
        try {
            const { familyGroupId } = req.params;

            if (!familyGroupId) {
                return res.status(400).json({
                    success: false,
                    message: "El ID del grupo familiar es requerido"
                });
            }

            const result = await this.affiliateService.listFamilyGroup(familyGroupId);

            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: "Grupo familiar no encontrado"
                });
            }

            return res.status(200).json({
                success: true,
                data: {
                    grupo: result.grupo,
                    afiliados: result.afiliados
                }
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: "Error al obtener el grupo familiar",
                error: err.message
            });
        }
    }
}

module.exports = AffiliateController;
