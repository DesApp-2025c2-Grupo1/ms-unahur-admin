const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class TherapeuticSituationRepository {

    async findAll() {
        const situations = await prisma.situacionTerapeutica.findMany();
        return situations;
    }

    async findById(id) {
        const situation = await prisma.situacionTerapeutica.findUnique({
            where: { idSituacion: parseInt(id) }
        });
        return situation
    }

}

module.exports = TherapeuticSituationRepository;
