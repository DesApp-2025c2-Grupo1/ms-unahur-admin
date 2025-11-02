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

    async getDniOfTheFamilyGroup(groupId) {
        return prisma.afiliado.findMany({
            select: { dni: true },
            where: { idGrupoFamiliarFK: groupId }
        });
    }

    async create(affiliate, credential, emails, telephones, situations, plan) {
        return await prisma.afiliado.create({
            data: {
                dni: affiliate.dni,
                nombre: affiliate.nombre,
                apellido: affiliate.apellido,
                credencial: `${credential}`,
                parentesco: affiliate.parentesco || 'Titular',
                direccion: affiliate.direccion,
                tipoDocumento: 'DNI',
                grupoFamiliar: {
                    create: {
                        idPlanFK: plan,
                        nroAfiliado: affiliate.baseCredencial
                    }
                },
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
                            fechaInicio: new Date(s.fecha_inicio),
                            fechaFin: s.fecha_fin ? new Date(s.fecha_fin) : null
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
