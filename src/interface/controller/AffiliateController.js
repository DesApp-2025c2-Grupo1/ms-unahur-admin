class AffiliateController {
    constructor(affiliateService) {
        this.affiliateService = affiliateService;
    }
    async findAll(req, res) {
        try {
            const affiliates = await this.affiliateService.findAll();
            console.log(affiliates)
            res.status(200).json({ affiliates });
        } catch (err) {
            console.log(err)
            res.status(500).json();
        }
    }

    //    async create(req, res) {
    //       try {
    //            const affiliates = await this.affiliateService.createAffiliate(req.body);
    //            res.status(201).json({ message: "Afiliado creado correctamente" });
    //        } catch (err) {
    //            console.log(err);
    //            res.status(500).json({ error: "No se pudo crear el afiliado" });
    //        }
    //    }

    async create(req, res) {
        try {
            const affiliate = await this.affiliateService.createAffiliate(req.body);
            res.status(201).json({
                message: "Afiliado creado correctamente",
                data: affiliate
            });
        } catch (err) {
            console.error("❌ Error en AffiliateController.create:", err); // 🔍 muestra todo el error
            res.status(400).json({
                error: err.message || "Error desconocido al crear el afiliado",
                detalle: err.meta || null, // Prisma a veces guarda info útil acá
                code: err.code || null
            });
        }
    }

    async getSituationsByDni(req, res) {
        try {
            const { dni } = req.params;
            if (!dni) {
                return res.status(400).json({ error: "DNI es requerido" });
            }

            const situaciones = await this.affiliateService.getTherapeuticSituationsByDni(dni);

            if (situaciones === null) {
                return res.status(404).json({ error: "Afiliado no encontrado" });
            }

            return res.status(200).json({ situaciones });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ error: "No se pudo obtener las situaciones terapéuticas" });
        }
    }


    async delete(req, res) {
        try {
            const { dni } = req.params;
            const result = await this.affiliateService.deleteAffiliate(dni);
            res.status(200).json(result);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }



    // async delete(req, res) {
    //     try {
    //         const { dni } = req.params;
    //         if (!dni) {
    //             return res.status(400).json({ error: "DNI es requerido" });
    //         }

    //         await this.affiliateService.deleteAffiliate(dni);
    //         res.status(200).json({ message: "Afiliado eliminado correctamente" });
    //     } catch (err) {
    //         res.status(404).json({ error: err.message });
    //     }
    // }
    async listFamilyGroup(req, res) {
        try {
            const { familyGroupId } = req.params;
            if (!familyGroupId) {
                return res.status(400).json({ error: "El ID del grupo familiar es requerido" });
            }

            const result = await this.affiliateService.listFamilyGroup(familyGroupId);

            if (result === null) {
                return res.status(404).json({ error: "Grupo familiar no encontrado" });
            }

            return res.status(200).json({ grupo: result.grupo, afiliados: result.afiliados });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ error: err.message });
        }
    }
}

module.exports = AffiliateController;
