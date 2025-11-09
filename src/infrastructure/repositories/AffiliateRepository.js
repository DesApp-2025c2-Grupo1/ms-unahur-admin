const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const TITULAR = 'Titular';

class AffiliateRepository2 {
    async findAll() {
        return prisma.afiliado.findMany({
            where: { parentesco: TITULAR, esta_activo: true },
            include: {
                emails: true, grupoFamiliar: {
                    select: { plan: true }
                },
                telefonos: {
                    select: { telefono: true }
                }
            }
        });
    }
    //obtiene el codigo del grupo familiar
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
                emails: true, grupoFamiliar: {
                    select: { plan: true }
                },
                telefonos: {
                    select: { telefono: true }
                }
            }
        });
    }

    async getDniOfTheFamilyGroup(groupId) {
        return prisma.afiliado.findMany({
            select: { dni: true },
            where: { idGrupoFamiliarFK: groupId }
        });
    }

    async create(affiliate, credential, emails, telephones, situations, plan, familyGroupId = null) {
        // Función inline para parsear fechas
        const parseDate = (dateStr) => {
            if (!dateStr) return null;
            if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return new Date(dateStr); // ISO
            const [day, month, year] = dateStr.split('/');
            return new Date(`${year}-${month}-${day}`); // DD/MM/YYYY -> YYYY-MM-DD
        };

        return await prisma.afiliado.create({
            data: {
                dni: affiliate.dni,
                nombre: affiliate.nombre,
                apellido: affiliate.apellido,
                credencial: `${credential}`,
                parentesco: affiliate.parentesco || 'Titular',
                direccion: affiliate.direccion || 'N/A',
                tipoDocumento: 'DNI',
                fecha_nacimiento: parseDate(affiliate.fecha_nacimiento), // 🔹 parsea directamente aquí
                grupoFamiliar: familyGroupId
                    ? { connect: { idGrupoFamiliar: familyGroupId } }
                    : { create: { idPlanFK: plan, nroAfiliado: credential } },
                emails: emails?.length
                    ? { create: emails.map(e => ({ email: e })) }
                    : undefined,
                telefonos: telephones?.length
                    ? { create: telephones.map(t => ({ telefono: t })) }
                    : undefined,
                situaciones: situations?.length
                    ? {
                        create: situations.map(s => ({
                            idSituacionFK: s.id,
                            fechaInicio: parseDate(s.fecha_inicio),
                            fechaFin: s.fecha_fin ? parseDate(s.fecha_fin) : null
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
        return await prisma.afiliado.findUnique({
            where: { dni: dni }
        })
    }

    async createMultipleAffiliates(affiliateList) {
        await prisma.afiliado.createMany({
            data: affiliateList
        })
    }

    async delete(dniList) {
        await prisma.afiliado.updateMany({
            where: { dni: { in: dniList }, esta_activo: true },
            data: { esta_activo: false },
        });
    }

    async update(dni, data) {
        await prisma.afiliado.update({
            where: {
                dni: dni
            },
            data: {
                dni: data.new_dni,
                nombre: data.nombre
            }
        });
    }

    async getCount() {
        return prisma.afiliado.count({
            where: {
                parentesco: TITULAR,
                esta_activo: true,
            }
        })
    }

    //Metodo que traiga la cantidad de familiares de un grupo
    async getCountFamilyMembers(dni) {
        return prisma.afiliado.count({
            where: {
                parentesco: TITULAR,
                esta_activo: true,
            }
        })
    }

    //TODO 
    //     async getTherapeuticSituationsByDni(dni) {
    //     try {
    //         const situaciones = await prisma.situacionAfiliado.findMany({
    //             where: { dniFK: dni },
    //             include: { situacionTerapeutica: true },
    //             orderBy: { fechaInicio: 'desc' }
    //         });

    //         return situaciones.map(s => situacionMapper.map(s));
    //     } catch (error) {
    //         throw new Error("No se pudieron obtener las situaciones terapéuticas")
    //     }
    // }

    // async existFamilyGroup(familyGroupId) {
    //     try {
    //         const grupo = await prisma.grupoFamiliar.findUnique({
    //             where: { idGrupoFamiliar: parseInt(familyGroupId) }
    //         })
    //         return grupo !== null
    //     } catch (error) {
    //         throw new Error("No se pudo verificar la existencia del grupo familiar")
    //     }
    // }

    // // Listar grupo familiar completo
    // async getByFamilyGroupId(familyGroupId) {
    //     try {
    //         const grupo = await prisma.grupoFamiliar.findUnique({
    //             where: { idGrupoFamiliar: parseInt(familyGroupId) },
    //             include: { plan: true }
    //         });

    //         if (!grupo) return null;

    //         const miembros = await prisma.afiliado.findMany({
    //             where: { idGrupoFamiliarFK: parseInt(familyGroupId) }
    //         });

    //         const afiliadosMapeados = miembros.map(m => mapper.map(m));

    //         return { grupo, afiliados: afiliadosMapeados };
    //     } catch (error) {
    //         throw new Error('No se pudieron obtener los miembros del grupo familiar');
    //     }
    // }

    // // Verificar existencia de grupo familiar
    // async existFamilyGroup(familyGroupId) {
    //     try {
    //         const grupo = await prisma.grupoFamiliar.findUnique({
    //             where: { idGrupoFamiliar: parseInt(familyGroupId) }
    //         });
    //         return grupo !== null;
    //     } catch (error) {
    //         throw new Error('No se pudo verificar la existencia del grupo familiar');
    //     }
    // }
}

module.exports = AffiliateRepository2;
