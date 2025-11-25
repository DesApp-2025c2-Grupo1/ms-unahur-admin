const { PrismaClient } = require('@prisma/client');
const ProviderMapper = require('../../mapper/ProviderMapper');

const prisma = new PrismaClient();
const mapper = new ProviderMapper();

class ProviderRepository {
    async findAll() {
        try {
            const prestadores = await prisma.prestador.findMany({
                include: {
                    lugaresAtencion: { include: { horarios: true } },
                    telefonos: true,
                    mails: true,
                    especialidades: { include: { especialidad: true } },
                    centroMedico: false
                }
            });

            return prestadores.map(p => mapper.map(p));
        } catch (error) {
            console.error('Error in ProviderRepository.findAll:', error);
            throw new Error('No se pudieron obtener los prestadores');
        }
    }

    async create(payload) {
        try {
            return await prisma.$transaction(async (tx) => {
                await tx.prestador.create({
                    data: {
                        cuitCuil: payload.cuitCuil,
                        nombreCompleto: payload.nombreCompleto,
                        tipoPrestador: payload.tipoPrestador,
                        centroMedicoId: payload.centroMedicoId || null,
                        telefonos: payload.telefonos ? { create: payload.telefonos.map(t => ({ telefono: t })) } : undefined,
                        mails: payload.mails ? { create: payload.mails.map(m => ({ mail: m })) } : undefined,
                    }
                });

                if (Array.isArray(payload.especialidades) && payload.especialidades.length > 0) {
                    const espData = payload.especialidades.map(id => ({ cuitCuilFK: payload.cuitCuil, idEspecialidadFK: parseInt(id) }));
                    await tx.prestadorEspecialidad.createMany({ data: espData, skipDuplicates: true });
                }

                if (Array.isArray(payload.lugaresAtencion) && payload.lugaresAtencion.length > 0) {
                    for (const lugar of payload.lugaresAtencion) {
                        const newLugar = await tx.lugarAtencion.create({
                            data: {
                                direccion: lugar.calle || "",
                                localidad: lugar.localidad || "",
                                codigoPostal: lugar.cp || "",
                                provincia: lugar.provincia || "",
                                cuitCuilFK: payload.cuitCuil,
                            }
                        });

                        if (Array.isArray(lugar.horarios) && lugar.horarios.length > 0) {
                            const horarioInserts = [];
                            for (const h of lugar.horarios) {
                                const dias = Array.isArray(h.dias) ? h.dias : [];
                                for (const dia of dias) {
                                    horarioInserts.push({
                                        idLugarFK: newLugar.idLugar,
                                        diaSemana: dia,
                                        horaDesde: h.desde,
                                        horaHasta: h.hasta
                                    });
                                }
                            }
                            if (horarioInserts.length > 0) {
                                await tx.horarioAtencion.createMany({ data: horarioInserts });
                            }
                        }
                    }
                }

                const created = await tx.prestador.findUnique({
                    where: { cuitCuil: payload.cuitCuil },
                    include: {
                        lugaresAtencion: { include: { horarios: true } },
                        telefonos: true,
                        mails: true,
                        especialidades: { include: { especialidad: true } }
                    }
                });
                return mapper.map(created);
            });
        } catch (error) {
            console.error('Error in ProviderRepository.create:', error.message, error);
            throw new Error(`No se pudo crear el prestador: ${error.message}`);
        }
    }

    async updateByCuitCuil(cuitCuil, payload) {
        try {
            console.log(`[ProviderRepository.updateByCuitCuil] Iniciando transacción para ${cuitCuil}`);
            return await prisma.$transaction(async (tx) => {
                const existing = await tx.prestador.findUnique({ where: { cuitCuil: cuitCuil } });
                if (!existing) throw new Error('Prestador no encontrado');

                console.log(`[updateByCuitCuil] Prestador encontrado, actualizando campos básicos`);

                // Update basic fields
                await tx.prestador.update({
                    where: { cuitCuil },
                    data: {
                        nombreCompleto: payload.nombreCompleto || existing.nombreCompleto,
                        tipoPrestador: payload.tipoPrestador || existing.tipoPrestador,
                        centroMedicoId: payload.centroMedicoId || null
                    }
                });

                // Replace telefonos
                console.log(`[updateByCuitCuil] Actualizando telefonos: ${payload.telefonos?.length || 0} registros`);
                await tx.telefonoPrestador.deleteMany({ where: { cuitCuilFK: cuitCuil } });
                if (Array.isArray(payload.telefonos) && payload.telefonos.length > 0) {
                    await tx.telefonoPrestador.createMany({ data: payload.telefonos.map(t => ({ cuitCuilFK: cuitCuil, telefono: t })) });
                }

                // Replace mails
                console.log(`[updateByCuitCuil] Actualizando mails: ${payload.mails?.length || 0} registros`);
                await tx.mailPrestador.deleteMany({ where: { cuitCuilFK: cuitCuil } });
                if (Array.isArray(payload.mails) && payload.mails.length > 0) {
                    await tx.mailPrestador.createMany({ data: payload.mails.map(m => ({ cuitCuilFK: cuitCuil, mail: m })) });
                }

                // Replace especialidades - Detect removed specialties to delete their agendas
                console.log(`[updateByCuitCuil] Actualizando especialidades: ${payload.especialidades?.length || 0} registros`);

                // Get current specialties before deletion
                const especialidadesActuales = await tx.prestadorEspecialidad.findMany({
                    where: { cuitCuilFK: cuitCuil },
                    select: { idEspecialidadFK: true }
                });

                const idsActuales = especialidadesActuales.map(e => e.idEspecialidadFK);
                const idsNuevos = payload.especialidades ? payload.especialidades.map(id => parseInt(id)) : [];
                const especialidadesEliminadas = idsActuales.filter(id => !idsNuevos.includes(id));

                // Delete agendas ONLY for removed specialties
                if (especialidadesEliminadas.length > 0) {
                    console.log(`[updateByCuitCuil] Especialidades eliminadas: ${especialidadesEliminadas.join(', ')}`);

                    const lugares = await tx.lugarAtencion.findMany({
                        where: { cuitCuilFK: cuitCuil },
                        select: { idLugar: true }
                    });

                    const idsLugares = lugares.map(l => l.idLugar);

                    if (idsLugares.length > 0) {
                        const agendasDeleted = await tx.agenda.deleteMany({
                            where: {
                                idLugarFK: { in: idsLugares },
                                idEspecialidadFK: { in: especialidadesEliminadas }
                            }
                        });
                        console.log(`[updateByCuitCuil] ⚠️ Agendas eliminadas por especialidades removidas: ${agendasDeleted.count}`);
                    }
                }

                // Now update the specialties
                await tx.prestadorEspecialidad.deleteMany({ where: { cuitCuilFK: cuitCuil } });
                if (Array.isArray(payload.especialidades) && payload.especialidades.length > 0) {
                    const espData = payload.especialidades.map(id => ({ cuitCuilFK: cuitCuil, idEspecialidadFK: parseInt(id) }));
                    await tx.prestadorEspecialidad.createMany({ data: espData, skipDuplicates: true });
                }

                // Handle lugaresAtencion update - Only delete agendas if places actually changed
                if (payload.lugaresAtencion !== undefined) {
                    console.log(`[updateByCuitCuil] Actualizando lugares de atención: ${payload.lugaresAtencion?.length || 0} registros`);

                    // Obtener lugares existentes
                    const lugaresExistentes = await tx.lugarAtencion.findMany({
                        where: { cuitCuilFK: cuitCuil },
                        select: {
                            idLugar: true,
                            direccion: true,
                            localidad: true,
                            provincia: true,
                            codigoPostal: true
                        },
                        orderBy: { idLugar: 'asc' }
                    });

                    // Verificar si los lugares realmente cambiaron
                    const lugaresNuevos = payload.lugaresAtencion || [];
                    const lugaresChanged =
                        lugaresExistentes.length !== lugaresNuevos.length ||
                        lugaresExistentes.some((lugarExist, idx) => {
                            const lugarNuevo = lugaresNuevos[idx];
                            if (!lugarNuevo) return true;
                            return (
                                lugarExist.direccion !== (lugarNuevo.calle || "") ||
                                lugarExist.localidad !== (lugarNuevo.localidad || "") ||
                                lugarExist.provincia !== (lugarNuevo.provincia || "") ||
                                lugarExist.codigoPostal !== (lugarNuevo.cp || "")
                            );
                        });

                    if (lugaresChanged) {
                        console.log(`[updateByCuitCuil] ⚠️ Lugares de atención modificados - eliminando agendas asociadas`);

                        const idsLugaresExistentes = lugaresExistentes.map(l => l.idLugar);

                        // Eliminar agendas asociadas a los lugares existentes
                        if (idsLugaresExistentes.length > 0) {
                            const agendasDeleted = await tx.agenda.deleteMany({
                                where: { idLugarFK: { in: idsLugaresExistentes } }
                            });
                            if (agendasDeleted.count > 0) {
                                console.log(`[updateByCuitCuil] ⚠️ Agendas eliminadas por modificación de lugares: ${agendasDeleted.count}`);
                            }
                        }

                        // Eliminar horarios de los lugares existentes
                        for (const lugar of lugaresExistentes) {
                            await tx.horarioAtencion.deleteMany({ where: { idLugarFK: lugar.idLugar } });
                        }

                        // Eliminar lugares existentes
                        await tx.lugarAtencion.deleteMany({ where: { cuitCuilFK: cuitCuil } });

                        // Crear nuevos lugares
                        if (Array.isArray(payload.lugaresAtencion) && payload.lugaresAtencion.length > 0) {
                            for (const lugar of payload.lugaresAtencion) {
                                const newLugar = await tx.lugarAtencion.create({
                                    data: {
                                        direccion: lugar.calle || "",
                                        localidad: lugar.localidad || "",
                                        codigoPostal: lugar.cp || "",
                                        provincia: lugar.provincia || "",
                                        cuitCuilFK: cuitCuil,
                                    }
                                });

                                // Crear horarios para este nuevo lugar
                                if (Array.isArray(lugar.horarios) && lugar.horarios.length > 0) {
                                    const horarioInserts = [];
                                    for (const h of lugar.horarios) {
                                        const dias = Array.isArray(h.dias) ? h.dias : [];
                                        for (const dia of dias) {
                                            horarioInserts.push({
                                                idLugarFK: newLugar.idLugar,
                                                diaSemana: dia,
                                                horaDesde: h.desde,
                                                horaHasta: h.hasta
                                            });
                                        }
                                    }
                                    if (horarioInserts.length > 0) {
                                        await tx.horarioAtencion.createMany({ data: horarioInserts });
                                    }
                                }
                            }
                        }
                    }
                }

                console.log(`[updateByCuitCuil] Obteniendo prestador actualizado`);
                const updated = await tx.prestador.findUnique({
                    where: { cuitCuil },
                    include: {
                        lugaresAtencion: { include: { horarios: true } },
                        telefonos: true,
                        mails: true,
                        especialidades: { include: { especialidad: true } }
                    }
                });
                console.log(`[updateByCuitCuil] ✅ Transacción completada exitosamente`);
                return mapper.map(updated);
            });
        } catch (error) {
            console.error(`[ProviderRepository.updateByCuitCuil] ❌ Error:`, error.message);
            console.error(`Stack:`, error.stack);
            throw new Error(`No se pudo actualizar el prestador: ${error.message}`);
        }
    }

    async deleteByCuitCuil(cuitCuil) {
        try {
            return await prisma.$transaction(async (tx) => {
                const existing = await tx.prestador.findUnique({ where: { cuitCuil } });
                if (!existing) throw new Error('Prestador no encontrado');

                // Obtener lugares para eliminar sus agendas
                const lugares = await tx.lugarAtencion.findMany({
                    where: { cuitCuilFK: cuitCuil },
                    select: { idLugar: true }
                });

                const idsLugares = lugares.map(l => l.idLugar);

                // Eliminar agendas asociadas a los lugares
                if (idsLugares.length > 0) {
                    await tx.agenda.deleteMany({
                        where: { idLugarFK: { in: idsLugares } }
                    });
                }

                // Delete dependent relations first
                await tx.prestadorEspecialidad.deleteMany({ where: { cuitCuilFK: cuitCuil } });
                await tx.telefonoPrestador.deleteMany({ where: { cuitCuilFK: cuitCuil } });
                await tx.mailPrestador.deleteMany({ where: { cuitCuilFK: cuitCuil } });

                // Delete agendas del prestador directamente
                await tx.agenda.deleteMany({ where: { cuitCuilFK: cuitCuil } });

                // Finally delete prestador (cascade will handle lugaresAtencion and horarios if configured)
                await tx.prestador.delete({ where: { cuitCuil } });

                return { message: `Prestador ${cuitCuil} eliminado correctamente` };
            });
        } catch (error) {
            console.error('Error in ProviderRepository.deleteByCuitCuil:', error);
            throw new Error('No se pudo eliminar el prestador: ' + error.message);
        }
    }
    async checkAgendasBySpecialty(cuitCuil, specialtyId) {
        try {
            // Obtener todos los lugares del prestador
            const lugares = await prisma.lugarAtencion.findMany({
                where: { cuitCuilFK: cuitCuil },
                select: { idLugar: true }
            });

            const lugarIds = lugares.map(l => l.idLugar);

            if (lugarIds.length === 0) return [];

            // Buscar agendas que usen esta especialidad y estos lugares
            const agendas = await prisma.agenda.findMany({
                where: {
                    idLugarFK: { in: lugarIds },
                    idEspecialidadFK: parseInt(specialtyId)
                },
                select: {
                    idAgenda: true,
                    especialidad: { select: { nombre: true } },
                    duracionTurno: true,
                    bloques: true
                }
            });

            return agendas;
        } catch (error) {
            console.error('Error in ProviderRepository.checkAgendasBySpecialty:', error);
            throw new Error('No se pudo verificar las agendas asociadas');
        }
    }

    async checkAgendasByPlaces(cuitCuil) {
        try {
            // Obtener todos los lugares del prestador
            const lugares = await prisma.lugarAtencion.findMany({
                where: { cuitCuilFK: cuitCuil },
                select: { idLugar: true }
            });

            const lugarIds = lugares.map(l => l.idLugar);

            if (lugarIds.length === 0) return [];

            // Buscar agendas que usen estos lugares
            const agendas = await prisma.agenda.findMany({
                where: {
                    idLugarFK: { in: lugarIds }
                },
                include: {
                    especialidad: { select: { nombre: true } },
                    lugar: { select: { direccion: true, localidad: true } }
                }
            });

            return agendas;
        } catch (error) {
            console.error('Error in ProviderRepository.checkAgendasByPlaces:', error);
            throw new Error('No se pudo verificar las agendas asociadas a los lugares');
        }
    }

    async findByCuitCuil(cuitCuil) {
        try {
            const p = await prisma.prestador.findUnique({
                where: { cuitCuil },
                include: {
                    lugaresAtencion: { include: { horarios: true } },
                    telefonos: true,
                    mails: true,
                    especialidades: { include: { especialidad: true } }
                }
            });
            return mapper.map(p);
        } catch (error) {
            console.error('Error in ProviderRepository.findByCuitCuil:', error);
            throw new Error('No se pudo obtener el prestador');
        }
    }
}



module.exports = ProviderRepository;