const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class AffiliateEmailRepository {
    async delete(dnis) {
        await prisma.afiliadoEmail.updateMany({
            where: {
                dniFK: { in: dnis },
                esta_activo: true
            },
            data: {
                esta_activo: false
            }
        });
    }

    async deleteEmail(dni, email) {
        await prisma.afiliadoEmail.update({
            where: {
                dniFK_email: {
                    dniFK: dni,
                    email: email
                },
                esta_activo: true
            },
            data: {
                esta_activo: false
            }
        });
    }
}
module.exports = AffiliateEmailRepository;