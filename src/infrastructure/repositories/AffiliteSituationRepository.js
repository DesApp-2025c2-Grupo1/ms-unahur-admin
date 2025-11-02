const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class AffiliateSituationRepository {

    async delete(dniList) {
        await prisma.situacionAfiliado.updateMany({
            where: {
                dniFK: { in: dnis },
                esta_activo: true 
            },
            data: {
                esta_activo: false
            }
        });
    }

}

module.exports = AffiliateSituationRepository;