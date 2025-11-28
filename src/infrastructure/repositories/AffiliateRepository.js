const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const TITULAR = 'Titular';

class AffiliateRepository2 {
    async findAll() {
        return prisma.afiliado.findMany({
            where: {
                parentesco: TITULAR,
                fecha_alta: { lte: new Date() }
            },
            include: {
                situaciones: {
                    where: { esta_activo: true },
                    include: {
                        situacionTerapeutica: true,
                    },
                },
                emails: {
                    where: { esta_activo: true },
                },
                grupoFamiliar: { select: { plan: true } },
                telefonos: {
                    where: { esta_activo: true }
                }
            }
        });
    }

    async findPending() {
        return prisma.afiliado.findMany({
            where: {
                parentesco: TITULAR,
                fecha_alta: { gt: new Date() }
            },
            include: {
                situaciones: {
                    where: { esta_activo: true },
                    include: {
                        situacionTerapeutica: true,
                    },
                },
                emails: {
                    where: { esta_activo: true },
                },
                grupoFamiliar: { select: { plan: true } },
                telefonos: {
                    where: { esta_activo: true }
                }
            }
        });
    }

    async getAffiliateByDni(dni) {
        return prisma.afiliado.findFirst({
            where: {
                dni
            },
            include: {
                situaciones: {
                    where: { esta_activo: true },
                    include: {
                        situacionTerapeutica: true,
                    },
                },
                emails: {
                    where: { esta_activo: true },
                },
                grupoFamiliar: {
                    select: { plan: true },
                },
                telefonos: {
                    where: { esta_activo: true },
                },
            },
        });
    }



    // obtiene el codigo del grupo familiar (retorna el id o null)
    async getFamilyGroupNumber(dni) {
        return prisma.afiliado.findFirst({
            select: { idGrupoFamiliarFK: true },
            where: { dni: dni, parentesco: TITULAR }
        })
    }

    async getFamily(groupId) {
        return prisma.afiliado.findMany({
            where: {
                idGrupoFamiliarFK: groupId,
                fecha_alta: { not: null }  // Excluir afiliados dados de baja
            },
            include: {
                situaciones: {
                    where: { esta_activo: true },
                    include: {
                        situacionTerapeutica: true,
                    },
                },
                emails: {
                },
                grupoFamiliar: {
                    select: { plan: true },
                },
                telefonos: {
                },
            },
        });
    }


    async getDniOfTheFamilyGroup(groupId) {
        return prisma.afiliado.findMany({
            select: { dni: true },
            where: { idGrupoFamiliarFK: groupId }
        });
    }


    /*parseDate = (date) => {
        if (!date) return null;
        if (date instanceof Date) return date;

        // Si viene en formato ISO (YYYY-MM-DD)
        if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            // Convertir a fecha al inicio del día en la zona horaria del servidor (UTC-3)
            const [year, month, day] = date.split('-');
            const d = new Date(Date.UTC(
                parseInt(year),
                parseInt(month) - 1,
                parseInt(day),
                3, // Ajuste para UTC-3 (sumar 3 horas)
                0,
                0
            ));
            return d;
        }

        // Si viene en formato DD/MM/YYYY
        const parts = date.split('/');
        if (parts.length === 3) {
            const [day, month, year] = parts;
            const d = new Date(Date.UTC(
                parseInt(year),
                parseInt(month) - 1,
                parseInt(day),
                3, // Ajuste para UTC-3
                0,
                0
            ));
            return d;
        }

        // Fallback: parse como está
        return new Date(date);
    };*/

    /**
 * Como la BD está en America/Argentina/Buenos_Aires,
 * NO necesitamos conversiones de zona horaria.
 * Solo parseamos correctamente.
 */

    parseDate = (date) => {
        if (!date) return null;
        if (date instanceof Date) return date;

        // Si viene en formato ISO (YYYY-MM-DD)
        if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            // Simplemente crear la fecha sin ajustes
            return new Date(date + 'T00:00:00');
        }

        // Si viene en formato DD/MM/YYYY
        const parts = date.split('/');
        if (parts.length === 3) {
            const [day, month, year] = parts;
            return new Date(`${year}-${month}-${day}T00:00:00`);
        }

        return new Date(date);
    };


    async create(affiliate, credential, emails, telephones, situations, plan, familyGroupId = null, fechaAlta = null) {
        /**
         * Lógica:
         * - Si NO viene fechaAlta: es alta inmediata → esta_activo = true, es_programada = false
         * - Si viene fechaAlta: es alta programada → esta_activo = false, es_programada = true
         */

        const esAltaInmediata = !fechaAlta;

        // Si es alta inmediata, usar NOW() de la BD
        // Si es alta programada, usar la fecha que viene
        let fechaAltaFinal = fechaAlta ? this.parseDate(fechaAlta) : new Date();

        return prisma.afiliado.create({
            data: {
                dni: affiliate.dni,
                nombre: affiliate.nombre,
                apellido: affiliate.apellido,
                credencial: `${credential}`,
                parentesco: affiliate.parentesco || TITULAR,
                direccion: affiliate.direccion || 'N/A',
                es_programada: !esAltaInmediata,
                fecha_alta: fechaAltaFinal,
                tipoDocumento: 'DNI',
                fecha_nacimiento: this.parseDate(affiliate.fecha_nacimiento),
                grupoFamiliar: familyGroupId
                    ? { connect: { idGrupoFamiliar: familyGroupId } }
                    : { create: { idPlanFK: plan, nroAfiliado: credential } },
                emails: emails?.length ? { create: emails.map(e => ({ email: e })) } : undefined,
                telefonos: telephones?.length ? { create: telephones.map(t => ({ telefono: t })) } : undefined,
                situaciones: situations?.length
                    ? {
                        create: situations.map(s => ({
                            idSituacionFK: s.id,
                            fechaInicio: this.parseDate(s.fecha_inicio),
                            fechaFin: s.fecha_fin ? this.parseDate(s.fecha_fin) : null
                        }))
                    }
                    : undefined
            },
            include: {
                grupoFamiliar: true,
                emails: true,
                telefonos: true,
                situaciones: true
            }
        });
    }

    parseDate = (date) => {
        if (!date) return null;
        if (date instanceof Date) return date;

        // Si viene en formato ISO (YYYY-MM-DD)
        if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            // La BD está en America/Argentina/Buenos_Aires, así que solo parseamos
            return new Date(date + 'T00:00:00');
        }

        // Si viene en formato DD/MM/YYYY
        const parts = date.split('/');
        if (parts.length === 3) {
            const [day, month, year] = parts;
            return new Date(`${year}-${month}-${day}T00:00:00`);
        }

        // Fallback
        return new Date(date);
    };


    async exists(dni) {
        return prisma.afiliado.findUnique({
            where: { dni }
        });
    }

    async createMultipleAffiliates(affiliateList) {
        return prisma.afiliado.createMany({
            data: affiliateList
        });
    }

    async delete(dniList) {
        // Marcar como eliminados seteando fecha_alta a null
        return prisma.afiliado.updateMany({
            where: { dni: { in: dniList } },
            data: { fecha_alta: null }
        });
    }

    async updatePlan(dni, idPlan) {
        // Obtener el grupo familiar del afiliado
        const affiliate = await prisma.afiliado.findUnique({
            where: { dni },
            select: { idGrupoFamiliarFK: true }
        });

        if (!affiliate || !affiliate.idGrupoFamiliarFK) {
            throw new Error("No se encontró el grupo familiar del afiliado");
        }

        // Actualizar el plan del grupo familiar
        return await prisma.grupoFamiliar.update({
            where: { idGrupoFamiliar: affiliate.idGrupoFamiliarFK },
            data: { idPlanFK: idPlan }
        });
    }

    async update(dni, data) {
        const {
            nombre,
            apellido,
            fecha_nacimiento,
            direccion,
            idPlan,
            telefonos = [],
            emails = [],
            situaciones = [],
            telefonosEliminados = [],
            emailsEliminados = [],
            situacionesEliminadas = []
        } = data;

        // Obtener afiliado actual con TODAS las situaciones (sin filtrar por esta_activo)
        const currentAffiliate = await prisma.afiliado.findUnique({
            where: { dni },
            include: {
                telefonos: { where: { esta_activo: true } },
                emails: { where: { esta_activo: true } },
                situaciones: {
                    where: { dniFK: dni }, // NO filtrar por esta_activo aquí
                    include: { situacionTerapeutica: true }
                }
            }
        });

        if (!currentAffiliate) {
            throw new Error(`Afiliado con DNI ${dni} no encontrado`);
        }

        // IMPORTANTE: ELIMINAR PRIMERO
        if (situacionesEliminadas.length > 0) {
            await prisma.situacionAfiliado.updateMany({
                where: {
                    idSituacionAfiliado: { in: situacionesEliminadas },
                    dniFK: dni
                },
                data: { esta_activo: false }
            });
        }

        // Eliminar teléfonos
        if (telefonosEliminados.length > 0) {
            await prisma.afiliadoTelefono.updateMany({
                where: {
                    id: { in: telefonosEliminados },
                    dniFK: dni
                },
                data: { esta_activo: false }
            });
        }

        // Eliminar emails
        if (emailsEliminados.length > 0) {
            await prisma.afiliadoEmail.updateMany({
                where: {
                    id: { in: emailsEliminados },
                    dniFK: dni
                },
                data: { esta_activo: false }
            });
        }

        // Actualizar datos básicos
        const updated = await prisma.afiliado.update({
            where: { dni },
            data: {
                nombre,
                apellido,
                direccion,
                fecha_nacimiento: this.parseDate(fecha_nacimiento)
            }
        });

        // Actualizar plan
        if (idPlan) {
            await this.updatePlan(dni, idPlan);
        }

        // Gestionar teléfonos
        if (telefonos.length > 0) {
            await this.updateTelephones(dni, currentAffiliate.telefonos, telefonos);
        }

        // Gestionar emails
        if (emails.length > 0) {
            await this.updateEmails(dni, currentAffiliate.emails, emails);
        }

        // Gestionar situaciones
        if (situaciones.length > 0) {
            const activeSituations = currentAffiliate.situaciones.filter(s => s.esta_activo);
            await this.updateSituations(dni, activeSituations, situaciones);
        }

        // Retornar afiliado actualizado
        const finalAffiliate = await prisma.afiliado.findUnique({
            where: { dni },
            include: {
                telefonos: { where: { esta_activo: true } },
                emails: { where: { esta_activo: true } },
                grupoFamiliar: { select: { plan: true } },
                situaciones: {
                    where: { esta_activo: true },
                    include: { situacionTerapeutica: true }
                }
            }
        });

        return finalAffiliate;
    }

    // Método auxiliar para actualizar teléfonos
    async updateTelephones(dni, currentTelephones, newTelephones) {
        const currentMap = new Map(currentTelephones.map(t => [t.id, t.telefono]));

        for (const tel of newTelephones) {
            if (tel.idTelefono && currentMap.has(tel.idTelefono)) {
                // Actualizar existente
                if (tel.telefono !== currentMap.get(tel.idTelefono)) {
                    await prisma.afiliadoTelefono.update({
                        where: { id: tel.idTelefono },
                        data: { telefono: tel.telefono }
                    });
                }
            } else if (!tel.idTelefono && tel.telefono) {
                // Crear nuevo
                await prisma.afiliadoTelefono.create({
                    data: {
                        dniFK: dni,
                        telefono: tel.telefono,
                        esta_activo: true
                    }
                });
            }
        }
    }

    // Método auxiliar para actualizar emails
    async updateEmails(dni, currentEmails, newEmails) {
        const currentMap = new Map(currentEmails.map(e => [e.id, e.email]));

        for (const mail of newEmails) {
            if (mail.idEmail && currentMap.has(mail.idEmail)) {
                // Actualizar existente
                if (mail.email !== currentMap.get(mail.idEmail)) {
                    await prisma.afiliadoEmail.update({
                        where: { id: mail.idEmail },
                        data: { email: mail.email }
                    });
                }
            } else if (!mail.idEmail && mail.email) {
                // Crear nuevo
                await prisma.afiliadoEmail.create({
                    data: {
                        dniFK: dni,
                        email: mail.email,
                        esta_activo: true
                    }
                });
            }
        }
    }

    // Método auxiliar para actualizar situaciones
    async updateSituations(dni, currentSituations, newSituations) {
        const currentMap = new Map(currentSituations.map(s => [s.idSituacionAfiliado, s]));


        for (const sit of newSituations) {

            if (sit.idSituacionAfiliado && currentMap.has(sit.idSituacionAfiliado)) {
                // Actualizar existente
                await prisma.situacionAfiliado.update({
                    where: { idSituacionAfiliado: sit.idSituacionAfiliado },
                    data: {
                        idSituacionFK: sit.idSituacion,
                        fechaInicio: this.parseDate(sit.fechaInicio),
                        fechaFin: sit.fechaFin ? this.parseDate(sit.fechaFin) : null
                    }
                });
            } else if (!sit.idSituacionAfiliado && sit.idSituacion) {
                // Crear nueva situación

                await prisma.situacionAfiliado.create({
                    data: {
                        dniFK: dni,
                        idSituacionFK: sit.idSituacion,
                        fechaInicio: this.parseDate(sit.fechaInicio),
                        fechaFin: sit.fechaFin ? this.parseDate(sit.fechaFin) : null,
                        esta_activo: true
                    }
                });
            }
        }

    }

    async getNextCredentialNumber() {
        // Get the affiliate with the highest credential number
        const maxAffiliate = await prisma.afiliado.findFirst({
            where: { parentesco: TITULAR },
            orderBy: { credencial: 'desc' },
            select: { credencial: true }
        });

        if (!maxAffiliate || !maxAffiliate.credencial) {
            return 1; // First affiliate
        }

        // Extract the base number from format XXXXXXX-XX
        const baseNumber = parseInt(maxAffiliate.credencial.split('-')[0], 10);
        return baseNumber + 1;
    }

    async updateAffiliatesPendingRegistration(dnis) {
        return prisma.afiliado.updateMany({
            where: { dni: { in: dnis } },
            data: {
                esta_activo: true,
                es_programada: false
            }
        });
    }

    // Metodo que trae la cantidad de familiares de un grupo a partir del dni del titular
    async getCountFamilyMembers(dni) {
        const groupId = await this.getFamilyGroupNumber(dni);
        if (!groupId) return 0;
        return prisma.afiliado.count({
            where: {
                idGrupoFamiliarFK: groupId,
                fecha_alta: {
                    lte: new Date(),
                    not: null  // Excluir afiliados dados de baja
                }
            }
        });
    }

    //Metodo para obtener los afiliados pendientes de alta (solo dni)
    async getAffiliatePendingRegistration() {
        return prisma.afiliado.findMany({
            select: { dni: true, fecha_alta: true },
            where: {
                esta_activo: false,
                es_programada: true
            }
        });
    }
}

module.exports = AffiliateRepository2;
