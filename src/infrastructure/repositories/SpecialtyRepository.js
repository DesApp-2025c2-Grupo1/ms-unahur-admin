const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class SpecialtyRepository {
    async findAll() {
        try {
            const rows = await prisma.especialidad.findMany({ orderBy: { idEspecialidad: 'asc' } });
            return rows.map(r => ({ idEspecialidad: r.idEspecialidad, nombre: r.nombre }));
        } catch (error) {
            console.error('Error in SpecialtyRepository.findAll:', error);
            throw new Error('No se pudieron obtener las especialidades');
        }
    }

    async findById(id) {
        try {
            const r = await prisma.especialidad.findUnique({ where: { idEspecialidad: parseInt(id) } });
            if (!r) return null;
            return { idEspecialidad: r.idEspecialidad, nombre: r.nombre };
        } catch (error) {
            console.error('Error in SpecialtyRepository.findById:', error);
            throw new Error('No se pudo obtener la especialidad');
        }
    }
}

module.exports = SpecialtyRepository;
