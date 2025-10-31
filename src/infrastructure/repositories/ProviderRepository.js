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

    async create(payload) {
        try {
            return await prisma.$transaction(async (tx) => {
                let idLugar = null;

                // Handle lugarAtencion: create new Lugar if provided without id, or use existing id
                if (payload.lugarAtencion) {
                    const lugar = payload.lugarAtencion;
                    if (lugar.idLugar) {
                        idLugar = lugar.idLugar;
                    } else {
                        const newLugar = await tx.lugarAtencion.create({
                            data: {
                                direccion: lugar.direccion || null,
                                localidad: lugar.localidad || null,
                                codigoPostal: lugar.codigoPostal || null,
                                provincia: lugar.provincia || null,
                            }
                        });
                        idLugar = newLugar.idLugar;

                        // create horarios rows if provided
                        const horarioInserts = [];
                        if (Array.isArray(lugar.horarios)) {
                            for (const h of lugar.horarios) {
                                const dias = Array.isArray(h.dias) ? h.dias : [];
                                for (const dia of dias) {
                                    horarioInserts.push({ idLugarFK: idLugar, diaSemana: dia, horaDesde: h.desde, horaHasta: h.hasta });
                                }
                            }
                        }
                        if (horarioInserts.length > 0) {
                            await tx.horarioAtencion.createMany({ data: horarioInserts });
                        }
                    }
                }

                // create prestador
                await tx.prestador.create({
                    data: {
                        cuitCuil: payload.cuitCuil,
                        nombreCompleto: payload.nombreCompleto,
                        tipoPrestador: payload.tipoPrestador,
                        centroMedicoId: payload.centroMedicoId || null,
                        idLugarFK: idLugar,
                        telefonos: payload.telefonos ? { create: payload.telefonos.map(t => ({ telefono: t })) } : undefined,
                        mails: payload.mails ? { create: payload.mails.map(m => ({ mail: m })) } : undefined,
                    }
                });

                // especialidades mapping (assume ids provided)
                if (Array.isArray(payload.especialidades) && payload.especialidades.length > 0) {
                    const espData = payload.especialidades.map(id => ({ cuitCuilFK: payload.cuitCuil, idEspecialidadFK: parseInt(id) }));
                    await tx.prestadorEspecialidad.createMany({ data: espData, skipDuplicates: true });
                }

                const created = await tx.prestador.findUnique({ where: { cuitCuil: payload.cuitCuil }, include: { lugarAtencion: { include: { horarios: true } }, telefonos: true, mails: true, especialidades: { include: { especialidad: true } } } });
                return mapper.map(created);
            });
        } catch (error) {
            console.error('Error in ProviderRepository.create:', error);
            throw new Error('No se pudo crear el prestador');
        }
    }

    async updateByCuitCuil(cuitCuil, payload) {
        try {
            return await prisma.$transaction(async (tx) => {
                const existing = await tx.prestador.findUnique({ where: { cuitCuil: cuitCuil } });
                if (!existing) throw new Error('Prestador no encontrado');

                // Update basic fields
                await tx.prestador.update({ where: { cuitCuil }, data: { nombreCompleto: payload.nombreCompleto || existing.nombreCompleto, tipoPrestador: payload.tipoPrestador || existing.tipoPrestador, centroMedicoId: payload.centroMedicoId || null } });

                // Replace telefonos
                await tx.telefonoPrestador.deleteMany({ where: { cuitCuilFK: cuitCuil } });
                if (Array.isArray(payload.telefonos) && payload.telefonos.length > 0) {
                    await tx.telefonoPrestador.createMany({ data: payload.telefonos.map(t => ({ cuitCuilFK: cuitCuil, telefono: t })) });
                }

                // Replace mails
                await tx.mailPrestador.deleteMany({ where: { cuitCuilFK: cuitCuil } });
                if (Array.isArray(payload.mails) && payload.mails.length > 0) {
                    await tx.mailPrestador.createMany({ data: payload.mails.map(m => ({ cuitCuilFK: cuitCuil, mail: m })) });
                }

                // Replace especialidades
                await tx.prestadorEspecialidad.deleteMany({ where: { cuitCuilFK: cuitCuil } });
                if (Array.isArray(payload.especialidades) && payload.especialidades.length > 0) {
                    const espData = payload.especialidades.map(id => ({ cuitCuilFK: cuitCuil, idEspecialidadFK: parseInt(id) }));
                    await tx.prestadorEspecialidad.createMany({ data: espData, skipDuplicates: true });
                }

                // Handle lugarAtencion update/create/remove
                if (payload.lugarAtencion) {
                    const lugar = payload.lugarAtencion;
                    if (lugar.idLugar) {
                        // Update existing lugar
                        await tx.lugarAtencion.update({ where: { idLugar: lugar.idLugar }, data: { direccion: lugar.direccion || undefined, localidad: lugar.localidad || undefined, codigoPostal: lugar.codigoPostal || undefined, provincia: lugar.provincia || undefined } });

                        // Replace horarios for that lugar
                        await tx.horarioAtencion.deleteMany({ where: { idLugarFK: lugar.idLugar } });
                        const horarioInserts = [];
                        if (Array.isArray(lugar.horarios)) {
                            for (const h of lugar.horarios) {
                                const dias = Array.isArray(h.dias) ? h.dias : [];
                                for (const dia of dias) {
                                    horarioInserts.push({ idLugarFK: lugar.idLugar, diaSemana: dia, horaDesde: h.desde, horaHasta: h.hasta });
                                }
                            }
                        }
                        if (horarioInserts.length > 0) await tx.horarioAtencion.createMany({ data: horarioInserts });

                        // set prestador.idLugarFK to this lugar
                        await tx.prestador.update({ where: { cuitCuil }, data: { idLugarFK: lugar.idLugar } });
                    } else {
                        // create new lugar and its horarios, then set prestador.idLugarFK
                        const newLugar = await tx.lugarAtencion.create({ data: { direccion: lugar.direccion || null, localidad: lugar.localidad || null, codigoPostal: lugar.codigoPostal || null, provincia: lugar.provincia || null } });
                        const horarioInserts = [];
                        if (Array.isArray(lugar.horarios)) {
                            for (const h of lugar.horarios) {
                                const dias = Array.isArray(h.dias) ? h.dias : [];
                                for (const dia of dias) {
                                    horarioInserts.push({ idLugarFK: newLugar.idLugar, diaSemana: dia, horaDesde: h.desde, horaHasta: h.hasta });
                                }
                            }
                        }
                        if (horarioInserts.length > 0) await tx.horarioAtencion.createMany({ data: horarioInserts });
                        await tx.prestador.update({ where: { cuitCuil }, data: { idLugarFK: newLugar.idLugar } });
                    }
                } else if (payload.lugarAtencion === null) {
                    // remove association
                    await tx.prestador.update({ where: { cuitCuil }, data: { idLugarFK: null } });
                }

                const updated = await tx.prestador.findUnique({ where: { cuitCuil }, include: { lugarAtencion: { include: { horarios: true } }, telefonos: true, mails: true, especialidades: { include: { especialidad: true } } } });
                return mapper.map(updated);
            });
        } catch (error) {
            console.error('Error in ProviderRepository.updateByCuitCuil:', error);
            throw new Error('No se pudo actualizar el prestador');
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
