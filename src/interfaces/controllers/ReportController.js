// src/adapters/controllers/ReportController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class ReportController {
    // 1. Altas de afiliados por periodo
    async getAltasAfiliados(req, res) {
        try {
            const { from, to } = req.query;

            if (!from || !to) {
                return res.status(400).json({
                    error: 'Se requieren los parámetros from y to'
                });
            }

            const results = await prisma.afiliado.findMany({
                where: {
                    fecha_alta: {
                        gte: new Date(from),
                        lte: new Date(to)
                    },
                    esta_activo: true, // Solo afiliados activos (altas ya efectivas)
                    // O si quieres incluir también los programados:
                    // OR: [
                    //     { esta_activo: true },
                    //     { es_programada: true }
                    // ]
                },
                include: {
                    grupoFamiliar: {
                        select: { plan: true }
                    }
                },
                orderBy: {
                    fecha_alta: 'desc'
                }
            });

            const formatted = results.map(r => ({
                dni: r.dni,
                nombre: r.nombre,
                apellido: r.apellido,
                plan: r.grupoFamiliar?.plan?.nombre || 'N/A',
                fechaAlta: r.fecha_alta,
                estado: r.es_programada ? 'Programada' : 'Activa' // Opcional: mostrar el estado
            }));

            return res.status(200).json(formatted);
        } catch (error) {
            console.error('Error en getAltasAfiliados:', error);
            return res.status(500).json({
                error: 'Error al obtener altas de afiliados'
            });
        }
    }


    // 2. Altas de prestadores por periodo
    async getAltasPrestadores(req, res) {
        try {
            const { from, to } = req.query;

            if (!from || !to) {
                return res.status(400).json({
                    error: 'Se requieren los parámetros from y to'
                });
            }

            const results = await prisma.prestador.findMany({
                where: {
                    fechaAlta: {
                        gte: new Date(from),
                        lte: new Date(to)
                    }
                },
                orderBy: {
                    fechaAlta: 'desc'
                }
            });

            const formatted = results.map(r => ({
                cuitCuil: r.cuitCuil,
                nombreCompleto: r.nombreCompleto,
                tipoPrestador: r.tipoPrestador,
                fechaAlta: r.fechaAlta
            }));

            return res.status(200).json(formatted);
        } catch (error) {
            console.error('Error en getAltasPrestadores:', error);
            return res.status(500).json({
                error: 'Error al obtener altas de prestadores'
            });
        }
    }

    // 3. Prestadores por especialidad
    async getPrestadoresPorEspecialidad(req, res) {
        try {
            const { specialtyId } = req.query;

            if (!specialtyId) {
                return res.status(400).json({
                    error: 'Se requiere el parámetro specialtyId'
                });
            }

            const results = await prisma.prestador.findMany({
                where: {
                    especialidades: {
                        some: {
                            idEspecialidadFK: parseInt(specialtyId)
                        }
                    }
                },
                include: {
                    especialidades: {
                        where: {
                            idEspecialidadFK: parseInt(specialtyId)
                        },
                        include: {
                            especialidad: true
                        }
                    }
                }
            });

            const formatted = results.map(r => ({
                cuitCuil: r.cuitCuil,
                nombreCompleto: r.nombreCompleto,
                tipoPrestador: r.tipoPrestador,
                especialidadNombre: r.especialidades[0]?.especialidad?.nombre
            }));

            return res.status(200).json(formatted);
        } catch (error) {
            console.error('Error en getPrestadoresPorEspecialidad:', error);
            return res.status(500).json({
                error: 'Error al obtener prestadores por especialidad'
            });
        }
    }

    // 4. Prestadores por código postal
    async getPrestadoresPorCodigoPostal(req, res) {
        try {
            const { cp } = req.query;

            if (!cp) {
                return res.status(400).json({
                    error: 'Se requiere el parámetro cp'
                });
            }

            const results = await prisma.prestador.findMany({
                where: {
                    lugaresAtencion: {
                        some: {
                            codigoPostal: cp
                        }
                    }
                },
                include: {
                    lugaresAtencion: {
                        where: {
                            codigoPostal: cp
                        }
                    }
                }
            });

            const formatted = results.map(r => ({
                cuitCuil: r.cuitCuil,
                nombreCompleto: r.nombreCompleto,
                tipoPrestador: r.tipoPrestador,
                codigoPostal: cp
            }));

            return res.status(200).json(formatted);
        } catch (error) {
            console.error('Error en getPrestadoresPorCodigoPostal:', error);
            return res.status(500).json({
                error: 'Error al obtener prestadores por código postal'
            });
        }
    }

    // 5. Prestadores sin agendas
    async getPrestadoresSinAgendas(req, res) {
        try {
            const results = await prisma.prestador.findMany({
                where: {
                    agendas: {
                        none: {}
                    }
                }
            });

            const formatted = results.map(r => ({
                cuitCuil: r.cuitCuil,
                nombreCompleto: r.nombreCompleto,
                tipoPrestador: r.tipoPrestador
            }));

            return res.status(200).json(formatted);
        } catch (error) {
            console.error('Error en getPrestadoresSinAgendas:', error);
            return res.status(500).json({
                error: 'Error al obtener prestadores sin agendas'
            });
        }
    }

    // 6. Situaciones por afiliado
    async getSituacionesPorAfiliado(req, res) {
        try {
            const { dni } = req.query;

            if (!dni) {
                return res.status(400).json({
                    error: 'Se requiere el parámetro dni'
                });
            }

            const afiliado = await prisma.afiliado.findUnique({
                where: { dni },
                include: {
                    situaciones: {
                        where: { esta_activo: true },
                        include: {
                            situacionTerapeutica: true
                        },
                        orderBy: {
                            fechaInicio: 'desc'
                        }
                    }
                }
            });

            if (!afiliado) {
                return res.status(404).json({
                    error: 'Afiliado no encontrado'
                });
            }

            const formatted = {
                afiliado: {
                    dni: afiliado.dni,
                    nombre: afiliado.nombre,
                    apellido: afiliado.apellido
                },
                situaciones: afiliado.situaciones.map(s => ({
                    idSituacionAfiliado: s.idSituacionAfiliado,
                    situacion: s.situacionTerapeutica?.nombre,
                    fechaInicio: s.fechaInicio,
                    fechaFin: s.fechaFin,
                    estado: s.fechaFin ? 'Finalizada' : 'Activa'
                }))
            };

            return res.status(200).json(formatted);
        } catch (error) {
            console.error('Error en getSituacionesPorAfiliado:', error);
            return res.status(500).json({
                error: 'Error al obtener situaciones del afiliado'
            });
        }
    }

    // 7. Situaciones por grupo familiar
    async getSituacionesPorGrupo(req, res) {
        try {
            const { dni } = req.query;

            if (!dni) {
                return res.status(400).json({
                    error: 'Se requiere el parámetro dni'
                });
            }

            // Primero obtener el grupo familiar del afiliado
            const afiliado = await prisma.afiliado.findUnique({
                where: { dni },
                select: { idGrupoFamiliarFK: true }
            });

            if (!afiliado || !afiliado.idGrupoFamiliarFK) {
                return res.status(404).json({
                    error: 'Afiliado o grupo familiar no encontrado'
                });
            }

            // Obtener todos los miembros del grupo con sus situaciones
            const miembros = await prisma.afiliado.findMany({
                where: {
                    idGrupoFamiliarFK: afiliado.idGrupoFamiliarFK,
                    esta_activo: true
                },
                include: {
                    situaciones: {
                        where: { esta_activo: true },
                        include: {
                            situacionTerapeutica: true
                        },
                        orderBy: {
                            fechaInicio: 'desc'
                        }
                    }
                },
                orderBy: {
                    parentesco: 'asc'
                }
            });

            const formatted = miembros.map(m => ({
                dni: m.dni,
                nombre: m.nombre,
                apellido: m.apellido,
                parentesco: m.parentesco,
                situaciones: m.situaciones.map(s => ({
                    idSituacionAfiliado: s.idSituacionAfiliado,
                    situacion: s.situacionTerapeutica?.nombre,
                    fechaInicio: s.fechaInicio,
                    fechaFin: s.fechaFin,
                    estado: s.fechaFin ? 'Finalizada' : 'Activa'
                }))
            }));

            return res.status(200).json(formatted);
        } catch (error) {
            console.error('Error en getSituacionesPorGrupo:', error);
            return res.status(500).json({
                error: 'Error al obtener situaciones del grupo familiar'
            });
        }
    }
}

module.exports = ReportController;