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

    async deleteTelephone(dni, telephone) {
        await prisma.afiliadoTelefono.update({
            where: {
                dniFK_telefono: { dniFK: dni, telefono: telephone },
                esta_activo: true
            },
            data: {
                esta_activo: false
            }
        });
    }

}
module.exports = AffiliateTelephoneRepository;