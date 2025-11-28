const { PrismaClient } = require('@prisma/client');
const AgendaMapper = require('../../mapper/AgendaMapper');

const prisma = new PrismaClient();
const mapper = new AgendaMapper();

class AgendaRepository {
    async findAll(filters = {}) {
        try {
            const where = { esta_activo: true };

            if (filters.cuitCuil) {
                where.cuitCuilFK = filters.cuitCuil;
            }

            if (filters.idEspecialidad) {
                where.idEspecialidadFK = parseInt(filters.idEspecialidad);
            }

            const agendas = await prisma.agenda.findMany({
                where,
                include: {
                    prestador: {
                        select: {
                            cuitCuil: true,
                            nombreCompleto: true,
                            tipoPrestador: true
                        }
                    },
                    especialidad: {
                        select: {
                            idEspecialidad: true,
                            nombre: true
                        }
                    },
                    lugar: {
                        select: {
                            idLugar: true,
                            direccion: true,
                            localidad: true,
                            provincia: true,
                            codigoPostal: true
                        }
                    },
                    bloques: {
                        orderBy: [
                            { diaSemana: 'asc' },
                            { horaDesde: 'asc' }
                        ]
                    }
                },
                orderBy: [
                    { prestador: { nombreCompleto: 'asc' } },
                    { fechaInicio: 'desc' }
                ]
            });

            return agendas.map(a => mapper.map(a));
        } catch (error) {
            throw new Error('No se pudieron obtener las agendas');
        }
    }

    async findById(id) {
        try {
            const agenda = await prisma.agenda.findUnique({
                where: { idAgenda: parseInt(id) },
                include: {
                    prestador: {
                        select: {
                            cuitCuil: true,
                            nombreCompleto: true,
                            tipoPrestador: true
                        }
                    },
                    especialidad: {
                        select: {
                            idEspecialidad: true,
                            nombre: true
                        }
                    },
                    lugar: {
                        select: {
                            idLugar: true,
                            direccion: true,
                            localidad: true,
                            provincia: true,
                            codigoPostal: true
                        }
                    },
                    bloques: {
                        orderBy: [
                            { diaSemana: 'asc' },
                            { horaDesde: 'asc' }
                        ]
                    }
                }
            });

            if (!agenda) return null;
            return mapper.map(agenda);
        } catch (error) {
            throw new Error('No se pudo obtener la agenda');
        }
    }

    async create(payload) {
        try {
            return await prisma.$transaction(async (tx) => {
                // Crear la agenda
                const agenda = await tx.agenda.create({
                    data: {
                        cuitCuilFK: payload.cuitCuil,
                        idEspecialidadFK: parseInt(payload.idEspecialidad),
                        idLugarFK: parseInt(payload.idLugar),
                        duracionTurno: parseInt(payload.duracionTurno),
                        fechaInicio: payload.fechaInicio ? new Date(payload.fechaInicio) : new Date(),
                        fechaFin: payload.fechaFin ? new Date(payload.fechaFin) : null,
                        esta_activo: true
                    }
                });

                // Crear los bloques horarios
                if (Array.isArray(payload.bloques) && payload.bloques.length > 0) {
                    const bloquesData = [];

                    for (const bloque of payload.bloques) {
                        const dias = Array.isArray(bloque.dias) ? bloque.dias : [];

                        for (const dia of dias) {
                            bloquesData.push({
                                idAgendaFK: agenda.idAgenda,
                                diaSemana: dia,
                                horaDesde: bloque.desde,
                                horaHasta: bloque.hasta
                            });
                        }
                    }

                    if (bloquesData.length > 0) {
                        await tx.bloqueHorarioAgenda.createMany({
                            data: bloquesData
                        });
                    }
                }

                // Obtener la agenda completa con todas las relaciones
                const created = await tx.agenda.findUnique({
                    where: { idAgenda: agenda.idAgenda },
                    include: {
                        prestador: {
                            select: {
                                cuitCuil: true,
                                nombreCompleto: true,
                                tipoPrestador: true
                            }
                        },
                        especialidad: {
                            select: {
                                idEspecialidad: true,
                                nombre: true
                            }
                        },
                        lugar: {
                            select: {
                                idLugar: true,
                                direccion: true,
                                localidad: true,
                                provincia: true,
                                codigoPostal: true
                            }
                        },
                        bloques: true
                    }
                });

                return mapper.map(created);
            });
        } catch (error) {
            throw new Error(`No se pudo crear la agenda: ${error.message}`);
        }
    }

    async update(id, payload) {
        try {
            return await prisma.$transaction(async (tx) => {
                const existing = await tx.agenda.findUnique({
                    where: { idAgenda: parseInt(id) }
                });

                if (!existing) {
                    throw new Error('Agenda no encontrada');
                }

                // Actualizar campos básicos de la agenda
                const updateData = {
                    duracionTurno: payload.duracionTurno ? parseInt(payload.duracionTurno) : existing.duracionTurno
                };

                if (payload.idEspecialidad) {
                    updateData.idEspecialidadFK = parseInt(payload.idEspecialidad);
                }

                if (payload.idLugar) {
                    updateData.idLugarFK = parseInt(payload.idLugar);
                }

                if (payload.fechaFin !== undefined) {
                    updateData.fechaFin = payload.fechaFin ? new Date(payload.fechaFin) : null;
                }

                await tx.agenda.update({
                    where: { idAgenda: parseInt(id) },
                    data: updateData
                });

                // Si se envían bloques, reemplazarlos
                if (payload.bloques !== undefined) {
                    // Eliminar bloques existentes
                    await tx.bloqueHorarioAgenda.deleteMany({
                        where: { idAgendaFK: parseInt(id) }
                    });

                    // Crear nuevos bloques
                    if (Array.isArray(payload.bloques) && payload.bloques.length > 0) {
                        const bloquesData = [];

                        for (const bloque of payload.bloques) {
                            const dias = Array.isArray(bloque.dias) ? bloque.dias : [];

                            for (const dia of dias) {
                                bloquesData.push({
                                    idAgendaFK: parseInt(id),
                                    diaSemana: dia,
                                    horaDesde: bloque.desde,
                                    horaHasta: bloque.hasta
                                });
                            }
                        }

                        if (bloquesData.length > 0) {
                            await tx.bloqueHorarioAgenda.createMany({
                                data: bloquesData
                            });
                        }
                    }
                }

                // Obtener la agenda actualizada
                const updated = await tx.agenda.findUnique({
                    where: { idAgenda: parseInt(id) },
                    include: {
                        prestador: {
                            select: {
                                cuitCuil: true,
                                nombreCompleto: true,
                                tipoPrestador: true
                            }
                        },
                        especialidad: {
                            select: {
                                idEspecialidad: true,
                                nombre: true
                            }
                        },
                        lugar: {
                            select: {
                                idLugar: true,
                                direccion: true,
                                localidad: true,
                                provincia: true,
                                codigoPostal: true
                            }
                        },
                        bloques: true
                    }
                });

                return mapper.map(updated);
            });
        } catch (error) {
            throw new Error(`No se pudo actualizar la agenda: ${error.message}`);
        }
    }

    async delete(id) {
        try {
            return await prisma.$transaction(async (tx) => {
                const existing = await tx.agenda.findUnique({
                    where: { idAgenda: parseInt(id) }
                });

                if (!existing) {
                    throw new Error('Agenda no encontrada');
                }

                // Soft delete: marcar como inactiva
                await tx.agenda.update({
                    where: { idAgenda: parseInt(id) },
                    data: { esta_activo: false }
                });

                return { message: `Agenda ${id} eliminada correctamente` };
            });
        } catch (error) {
            throw new Error(`No se pudo eliminar la agenda: ${error.message}`);
        }
    }
}

module.exports = AgendaRepository;