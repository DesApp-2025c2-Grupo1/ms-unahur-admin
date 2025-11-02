const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class AffiliateTelephoneRepository {

    async delete(dnis) {
        await prisma.afiliadoTelefono.updateMany({
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
module.exports = AffiliateTelephoneRepository;