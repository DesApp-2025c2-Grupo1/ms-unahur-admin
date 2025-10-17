class AffiliateController {
    constructor(affiliateService) {
        this.affiliateService = affiliateService;
    }

    // Obtener todos los afiliados
    async list(req, res) {
        try {
            const affiliates = await this.affiliateService.listAffiliates();
            res.status(200).json(affiliates);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Crear un nuevo afiliado
    async create(req, res) {
        try {
            const affiliate = await this.affiliateService.createAffiliate(req.body);
            res.status(201).json({
                message: "Afiliado creado correctamente",
                data: affiliate
            });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    // Eliminar afiliado por DNI
    async delete(req, res) {
        try {
            const { dni } = req.params;
            if (!dni) {
                return res.status(400).json({ error: "DNI es requerido" });
            }

            await this.affiliateService.deleteAffiliate(dni);
            res.status(200).json({ message: "Afiliado eliminado correctamente" });
        } catch (err) {
            res.status(404).json({ error: err.message });
        }
    }

    // Listar grupo familiar por ID
    async listFamilyGroup(req, res) {
        try {
            const { familyGroupId } = req.params;
            if (!familyGroupId) {
                return res.status(400).json({ error: "El ID del grupo familiar es requerido" });
            }

            const familyGroup = await this.affiliateService.listFamilyGroup(familyGroupId);
            res.status(200).json(familyGroup);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = AffiliateController;
