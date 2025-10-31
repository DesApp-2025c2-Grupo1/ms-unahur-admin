const { PrismaClient } = require('@prisma/client');
const ProviderMapper = require('../../mapper/ProviderMapper');

const prisma = new PrismaClient();
const mapper = new ProviderMapper();

class ProviderRepository {
    async findAll() {
        try {
            const prestadores = await prisma.prestador.findMany({
                include: {
                    lugarAtencion: { include: { horarios: true } },
                    telefonos: true,
                    mails: true,
                    especialidades: { include: { especialidad: true } },
                    centroMedico: false // do not eager-load the full centroMedico to avoid circular heavy loads
                }
            });

            return prestadores.map(p => mapper.map(p));
        } catch (error) {
            console.error('Error in ProviderRepository.findAll:', error);
            throw new Error('No se pudieron obtener los prestadores');
        }
    }

    // Placeholder methods for future endpoints
    async findByCuitCuil(cuitCuil) {
        try {
            const p = await prisma.prestador.findUnique({
                where: { cuitCuil },
                include: { lugarAtencion: { include: { horarios: true } }, telefonos: true, mails: true, especialidades: { include: { especialidad: true } } }
            });
            return mapper.map(p);
        } catch (error) {
            console.error('Error in ProviderRepository.findByCuitCuil:', error);
            throw new Error('No se pudo obtener el prestador');
        }
    }
}

module.exports = ProviderRepository;
