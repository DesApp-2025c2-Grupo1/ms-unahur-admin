const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


class AffiliateSituationRepository {
    // async create(dni, id_situation) {
    //     await prisma.situacionAfiliado.create({
    //         data: {
    //             dniFK: dni,
    //             fechaInicio: new Date(s.fechaInicio),
    //             fechaFin: s.fechaFin ? new Date(s.fechaFin) : null,
    //             situacionTerapeutica: {
    //                 connect: { idSituacion: id_situation }
    //             }
    //         }
    //     });
    // }
    async delete(dnis) {
        await prisma.situacionAfiliado.deleteMany()
    }
}

module.exports = AffiliateSituationRepository;