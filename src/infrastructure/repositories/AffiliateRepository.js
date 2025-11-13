const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const TITULAR = 'Titular';

class AffiliateRepository2 {
    async findAll() {
        return prisma.afiliado.findMany({
            where: { parentesco: TITULAR, esta_activo: true },
            include: {
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
                dni,
                // ❌ REMOVIDO: parentesco: TITULAR,
                esta_activo: true,
            },
            include: {
                situaciones: {
                    where: { dniFK: dni, esta_activo: true },
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
            where: { idGrupoFamiliarFK: groupId, esta_activo: true },
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
                    where: { esta_activo: true }
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


    parseDate = (date) => {
        if (!date) return null;
        if (date instanceof Date) return date;

        // Si viene en formato ISO (YYYY-MM-DD)
        if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            // Agregar la hora al mediodía para evitar problemas de timezone
            return new Date(date + 'T12:00:00.000Z');
        }

        // Si viene en formato DD/MM/YYYY
        const parts = date.split('/');
        if (parts.length === 3) {
            const [day, month, year] = parts;
            // Crear fecha al mediodía UTC
            return new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day), 12, 0, 0));
        }

        return new Date(date);
    };


    async create(affiliate, credential, emails, telephones, situations, plan, familyGroupId = null, fechaAlta = null) {
        if (fechaAlta) {
            return prisma.afiliado.create({
                data: {
                    dni: affiliate.dni,
                    nombre: affiliate.nombre,
                    apellido: affiliate.apellido,
                    credencial: `${credential}`,
                    parentesco: affiliate.parentesco || TITULAR,
                    direccion: affiliate.direccion || 'N/A',
                    es_programada: true,
                    fecha_alta: this.parseDate(fechaAlta),
                    tipoDocumento: 'DNI',
                    esta_activo: false,
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
            })
        }
        return prisma.afiliado.create({
            data: {
                dni: affiliate.dni,
                nombre: affiliate.nombre,
                apellido: affiliate.apellido,
                credencial: `${credential}`,
                parentesco: affiliate.parentesco || TITULAR,
                direccion: affiliate.direccion || 'N/A',
                tipoDocumento: 'DNI',
                emails: emails?.length ? { create: emails.map(e => ({ email: e })) } : undefined,
                telefonos: telephones?.length ? { create: telephones.map(t => ({ telefono: t })) } : undefined,
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
        return prisma.afiliado.updateMany({
            where: { dni: { in: dniList }, esta_activo: true },
            data: { esta_activo: false }
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

        console.log("Repository - Iniciando update");
        console.log("Repository - Situaciones a eliminar:", situacionesEliminadas);
        console.log("Repository - Situaciones a actualizar:", situaciones);

        //Obtener afiliado actual - SIN filtrar situaciones por esta_activo
        const currentAffiliate = await prisma.afiliado.findUnique({
            where: { dni },
            include: {
                telefonos: { where: { esta_activo: true } },
                emails: { where: { esta_activo: true } },
                situaciones: {
                    //QUITAR el filtro esta_activo aquí para poder procesarlas
                    where: { dniFK: dni },
                    include: { situacionTerapeutica: true }
                }
            }
        });

        if (!currentAffiliate) {
            throw new Error(`Afiliado con DNI ${dni} no encontrado`);
        }

        console.log("Repository - Todas las situaciones en BD:",
            currentAffiliate.situaciones.map(s => `ID:${s.idSituacionAfiliado} activo:${s.esta_activo}`)
        );

        //IMPORTANTE: ELIMINAR PRIMERO, ANTES DE ACTUALIZAR

        //Eliminar situaciones marcadas
        if (situacionesEliminadas.length > 0) {
            console.log("ANTES DE ELIMINAR - Intentando eliminar situaciones:", situacionesEliminadas);

            //QUITAR el filtro esta_activo: true del where para que encuentre las situaciones
            const deleteResult = await prisma.situacionAfiliado.updateMany({
                where: {
                    idSituacionAfiliado: { in: situacionesEliminadas },
                    dniFK: dni
                    //NO poner: esta_activo: true
                },
                data: { esta_activo: false }
            });

            console.log(`Situaciones marcadas como inactivas: ${deleteResult.count} de ${situacionesEliminadas.length}`);
        }

        // Eliminar teléfonos marcados
        if (telefonosEliminados.length > 0) {
            console.log("Eliminando teléfonos:", telefonosEliminados);
            await prisma.afiliadoTelefono.updateMany({
                where: {
                    id: { in: telefonosEliminados },
                    dniFK: dni
                },
                data: { esta_activo: false }
            });
        }

        // Eliminar emails marcados
        if (emailsEliminados.length > 0) {
            console.log("Eliminando emails:", emailsEliminados);
            await prisma.afiliadoEmail.updateMany({
                where: {
                    id: { in: emailsEliminados },
                    dniFK: dni
                },
                data: { esta_activo: false }
            });
        }

        // AHORA SÍ, ACTUALIZAR DATOS BÁSICOS
        const updated = await prisma.afiliado.update({
            where: { dni },
            data: {
                nombre,
                apellido,
                direccion,
                fecha_nacimiento: this.parseDate(fecha_nacimiento)
            }
        });

        // Actualizar plan si viene
        if (idPlan) {
            await this.updatePlan(dni, idPlan);
        }

        // Gestionar teléfonos
        if (telefonos.length > 0) {
            // Filtrar solo los activos para el update
            const activePhones = currentAffiliate.telefonos.filter(t => t.esta_activo);
            await this.updateTelephones(dni, activePhones, telefonos);
        }

        // Gestionar emails
        if (emails.length > 0) {
            // Filtrar solo los activos para el update
            const activeEmails = currentAffiliate.emails.filter(e => e.esta_activo);
            await this.updateEmails(dni, activeEmails, emails);
        }

        // Gestionar situaciones (crear y actualizar)
        if (situaciones.length > 0) {
            console.log("Procesando situaciones...");
            // Filtrar solo las activas para el update
            const activeSituations = currentAffiliate.situaciones.filter(s => s.esta_activo);
            await this.updateSituations(dni, activeSituations, situaciones);
        }

        // Retornar el afiliado actualizado con SOLO las relaciones ACTIVAS
        const finalAffiliate = await prisma.afiliado.findUnique({
            where: { dni },
            include: {
                telefonos: { where: { esta_activo: true } },
                emails: { where: { esta_activo: true } },
                grupoFamiliar: { select: { plan: true } },
                situaciones: {
                    where: { esta_activo: true }, // Al final sí filtrar por activas
                    include: { situacionTerapeutica: true }
                }
            }
        });

        console.log("Repository - Update finalizado");
        console.log("Repository - Situaciones finales (activas):",
            finalAffiliate.situaciones.map(s => s.idSituacionAfiliado)
        );

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

        console.log("updateSituations - Situaciones actuales en BD:", Array.from(currentMap.keys()));
        console.log("updateSituations - Nuevas situaciones recibidas:", newSituations);

        for (const sit of newSituations) {
            console.log("Procesando situación:", sit);

            if (sit.idSituacionAfiliado && currentMap.has(sit.idSituacionAfiliado)) {
                // Actualizar existente
                console.log(`Actualizando situación existente ID: ${sit.idSituacionAfiliado}`);

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
                console.log(`Creando nueva situación con idSituacion: ${sit.idSituacion}`);

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

        console.log(" updateSituations - Situaciones procesadas correctamente");
    }

    async getCount() {
        return prisma.afiliado.count({
            where: {
                parentesco: TITULAR,
                esta_activo: true
            }
        });
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
                esta_activo: true
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
