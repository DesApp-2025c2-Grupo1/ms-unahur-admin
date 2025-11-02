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
            where: { idGrupoFamiliarFK: groupId }
        });
    }

    async create(affiliate) {
        await prisma.afiliado.create({
            data: affiliate
        })
    }

    async createMultipleAffiliates(affiliateList) {
        await prisma.afiliado.createMany({
            data: affiliateList
        })
    }

    async delete(dniList) {
        await prisma.afiliado.updateMany({
            where: { dni: { in: dniList }, esta_activo: true },
            data: { esta_activo: false },
        });
    }

    async getCount() {
        return prisma.afiliado.count({
            where: { parentesco: TITULAR }
        })
    }
}

module.exports = AffiliateRepository2;
