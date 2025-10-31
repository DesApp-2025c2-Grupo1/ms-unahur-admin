const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const PARENTESCO = 'Titular';

class AffiliateRepository2 {
    async findAll() {
        return prisma.afiliado.findMany({
            where: { parentesco: PARENTESCO }
        });
    }
    //obtiene el codigo del grupo familiar
    async getFamilyGroupNumber(dni) {
    }
}

module.exports = AffiliateRepository2;
