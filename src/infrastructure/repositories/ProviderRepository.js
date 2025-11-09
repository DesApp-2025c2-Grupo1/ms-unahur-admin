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
                    centroMedico: false // do not eager-load the full centroMedico to avoid circular heavy loads
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
                // create prestador sin lugares (los lugares se asocian después)
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

                // Crear especialidades
                if (Array.isArray(payload.especialidades) && payload.especialidades.length > 0) {
                    const espData = payload.especialidades.map(id => ({ cuitCuilFK: payload.cuitCuil, idEspecialidadFK: parseInt(id) }));
                    await tx.prestadorEspecialidad.createMany({ data: espData, skipDuplicates: true });
                }

                // Crear lugares de atención (si se proporcionan)
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

                        // Crear horarios para este lugar
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

                // Replace especialidades
                console.log(`[updateByCuitCuil] Actualizando especialidades: ${payload.especialidades?.length || 0} registros`);
                await tx.prestadorEspecialidad.deleteMany({ where: { cuitCuilFK: cuitCuil } });
                if (Array.isArray(payload.especialidades) && payload.especialidades.length > 0) {
                    const espData = payload.especialidades.map(id => ({ cuitCuilFK: cuitCuil, idEspecialidadFK: parseInt(id) }));
                    await tx.prestadorEspecialidad.createMany({ data: espData, skipDuplicates: true });
                }

                // Handle lugaresAtencion update: delete existing and create new
                if (payload.lugaresAtencion !== undefined) {
                    console.log(`[updateByCuitCuil] Actualizando lugares de atención: ${payload.lugaresAtencion?.length || 0} registros`);
                    
                    // Obtener lugares existentes
                    const lugaresExistentes = await tx.lugarAtencion.findMany({ where: { cuitCuilFK: cuitCuil } });
                    
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

                // Delete dependent relations first
                await tx.prestadorEspecialidad.deleteMany({ where: { cuitCuilFK: cuitCuil } });
                await tx.telefonoPrestador.deleteMany({ where: { cuitCuilFK: cuitCuil } });
                await tx.mailPrestador.deleteMany({ where: { cuitCuilFK: cuitCuil } });

                // Attempt to delete agendas if any (Agenda has FK to Prestador and is RESTRICT on delete)
                await tx.agenda.deleteMany({ where: { cuitCuilFK: cuitCuil } });

                // Finally delete prestador
                await tx.prestador.delete({ where: { cuitCuil } });

                return { message: `Prestador ${cuitCuil} eliminado correctamente` };
            });
        } catch (error) {
            console.error('Error in ProviderRepository.deleteByCuitCuil:', error);
            throw new Error('No se pudo eliminar el prestador: ' + error.message);
        }
    }

    // Placeholder methods for future endpoints
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
