const { PrismaClient } = require('@prisma/client');
const TherapeuticSituationMapper = require('../../mapper/TherapeuticSituationMapper');

const prisma = new PrismaClient();
const mapper = new TherapeuticSituationMapper();

class TherapeuticSituationRepository {

    async findAll() {
        const situaciones = await prisma.situacionTerapeutica.findMany();
        return situaciones.map(s => mapper.map(s));
    }

    async findById(id) {
        const situacion = await prisma.situacionTerapeutica.findUnique({
            where: { idSituacion: parseInt(id) }
        });
        return mapper.map(situacion);
    }
}

module.exports = TherapeuticSituationRepository;
