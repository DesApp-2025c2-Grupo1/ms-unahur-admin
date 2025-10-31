const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const TITULAR = 'Titular';

class AffiliateRepository2 {
    async findAll() {
        return prisma.afiliado.findMany({
            where: { parentesco: TITULAR, esta_activo: true },
            include: {
                emails: true, grupoFamiliar: {
                    select: { plan: true }
                }
            }
        });
    }
    //obtiene el codigo del grupo familiar
    async getFamilyGroupNumber(dni) {
        return prisma.afiliado.findFirst({
            select: { idGrupoFamiliarFK: true },
            where: { dni: dni, parentesco: TITULAR }
        })
    }

    async getDniOfTheFamilyGroup(groupId) {
        return prisma.afiliado.findMany({
            select: { dni: true },
            where: groupId
        })
    }

    async create() {

    }

    async delete(dnis) {
        await prisma.afiliado.updateMany({
            where: {
                dni: { in: dnis },
                esta_activo: true
            },
            data: { esta_activo: false }
        })
    }
}

module.exports = AffiliateRepository2;
