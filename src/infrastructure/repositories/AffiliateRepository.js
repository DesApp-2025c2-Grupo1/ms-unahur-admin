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
                parentesco: TITULAR,
                esta_activo: true,
            },
            include: {
                situaciones: {
                    where: { dniFK: dni },
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
            where: { idGrupoFamiliarFK: groupId },
            include: {
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
        if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return new Date(date); // ISO
        const parts = date.split('/');
        if (parts.length === 3) {
            const [day, month, year] = parts;
            return new Date(`${year}-${month}-${day}`);
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

    async update(dni, data) {
        console.log(data.telefonos);

        return prisma.afiliado.update({
            where: { dni },
            data: {
                nombre: data.nombre,
                apellido: data.apellido,
                fecha_nacimiento: data.fecha_nacimiento,

                // 🔹 Actualiza teléfonos
                telefonos: data.telefonos?.length
                    ? {
                        update: data.telefonos.map(t => ({
                            where: { id: t.idTelefono },
                            data: { telefono: t.nuevo_telefono },
                        })),
                    }
                    : undefined,

                // 🔹 Actualiza emails
                emails: data.emails?.length
                    ? {
                        update: data.emails.map(e => ({
                            where: { id: e.idEmail },
                            data: { email: e.nuevo_email ?? e.email },
                        })),
                    }
                    : undefined,

                // 🔹 Actualiza situaciones
                situaciones: data.situaciones?.length
                    ? {
                        update: data.situaciones.map(s => ({
                            where: { idSituacionFK: s.idSituacion },
                            data: {
                                fechaInicio: this.parseDate(s.fecha_inicio),
                                fechaFin: s.fecha_fin ? this.parseDate(s.fecha_fin) : null
                            },
                        })),
                    }
                    : undefined,
            },
        });
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
