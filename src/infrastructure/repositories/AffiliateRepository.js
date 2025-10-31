const { PrismaClient } = require('@prisma/client');
const AffiliateMapper = require('../../mapper/AffiliateMapper');
const SituacionAfiliadoMapper = require('../../mapper/SituacionAfiliadoMapper');

const prisma = new PrismaClient();
const mapper = new AffiliateMapper();
const situacionMapper = new SituacionAfiliadoMapper();

class AffiliateRepository {
    // Obtener todos los afiliados titulares
    async findAll() {
        const affiliates = await prisma.afiliado.findMany({
            where: { parentesco: 'Titular' },
            include: {
                grupoFamiliar: {
                    include: {
                        plan: {
                            select: {
                                idPlan: true,
                                nombre: true,
                            },
                        },
                    },
                },
            },
        });
        return affiliates.map(aff => mapper.map(aff))
    }

    // Crear afiliado titular y su grupo familiar
    async create({ dni, nombre, apellido, emails, telefonos, direccion, plan, familiares, situaciones }) {
        if (await this.existByDni(dni)) {
            throw new Error('El DNI ya se encuentra registrado');
        }

        const count = await this.getCount();
        const nextFamilyNumber = count + 1;
        const baseCredencial = nextFamilyNumber.toString().padStart(7, '0');

        try {
            // Crear afiliado titular y grupo familiar
            const titular = await prisma.afiliado.create({
                data: {
                    dni,
                    nombre,
                    apellido,
                    credencial: `${baseCredencial}-01`,
                    parentesco: 'Titular',
                    direccion,
                    tipoDocumento: 'DNI',
                    grupoFamiliar: {
                        create: {
                            idPlanFK: plan,
                            nroAfiliado: baseCredencial
                        }
                    },
                    emails: {
                        create: emails?.map(e => ({ email: e.email }))
                    },
                    telefonos: {
                        create: telefonos?.map(t => ({ telefono: t.telefono }))
                    }
                },
                include: { grupoFamiliar: true, emails: true, telefonos: true }
            });

            // Insertar familiares si existen
            if (familiares?.length > 0) {
                await this.insertFamily(titular, familiares, baseCredencial);
            }

            // Insertar situaciones terapéuticas si existen
            if (situaciones?.length > 0) {
                await this.insertSituations(titular, situaciones);
            }

            return mapper.map(titular);
        } catch (error) {
            console.error(error);
            throw new Error('No se pudo crear el afiliado');
        }
    }

    // Insertar familiares en el grupo del titular
    async insertFamily(titular, familiares, baseCredencial) {
        try {
            for (let i = 0; i < familiares.length; i++) {
                const f = familiares[i];

                if (await this.existByDni(f.dni)) {
                    throw new Error(`El DNI ${f.dni} ya se encuentra registrado`);
                }

                const credencialFamiliar = `${baseCredencial}-${(i + 2).toString().padStart(2, '0')}`;

                await prisma.afiliado.create({
                    data: {
                        dni: f.dni,
                        nombre: f.nombre,
                        apellido: f.apellido,
                        credencial: credencialFamiliar,
                        parentesco: f.parentesco,
                        direccion: f.direccion,
                        tipoDocumento: 'DNI',
                        grupoFamiliar: { connect: { idGrupoFamiliar: titular.grupoFamiliar.idGrupoFamiliar } },
                        emails: { create: f.emails?.map(e => ({ email: e.email })) },
                        telefonos: { create: f.telefonos?.map(t => ({ telefono: t.telefono })) }
                    }
                });

                // Insertar situaciones terapéuticas del familiar si existen
                if (f.situaciones?.length > 0) {
                    await this.insertSituations({ dni: f.dni }, f.situaciones);
                }
            }
        } catch (error) {
            console.error(error);
            throw new Error('No se pudieron registrar los familiares');
        }
    }

    // Insertar situaciones terapéuticas
    async insertSituations(afiliado, situaciones) {
        try {
            for (const s of situaciones) {
                await prisma.situacionAfiliado.create({
                    data: {
                        dniFK: afiliado.dni, 
                        fechaInicio: new Date(s.fechaInicio),
                        fechaFin: s.fechaFin ? new Date(s.fechaFin) : null,
                        situacionTerapeutica: {
                            connect: { idSituacion: s.idSituacionFK } 
                        }
                    }
                });
            }
        } catch (error) {
            console.error(error);
            throw new Error('No se pudieron registrar las situaciones terapéuticas');
        }
    }


    // Editar afiliado
    async update({ dni, nombre, apellido, email, telefono, direccion, new_dni }) {
        if (await this.existByDni(new_dni)) {
            throw new Error('El DNI ya se encuentra registrado');
        }

        try {
            const titular = await prisma.afiliado.update({
                where: { dni: dni },
                data: {
                    dni: new_dni,
                    nombre,
                    apellido,
                    email,
                    telefono,
                    direccion,
                }

            });
            return null;
        } catch (error) {
            console.log(error)
            throw new Error('No se pudo editar el afiliado');
        }
    }


    // Eliminar afiliado o grupo familiar por DNI
    async deleteByDni(dni) {
        let dnisToDelete = [];
        try {
            const affiliate = await prisma.afiliado.findUnique({
                where: { dni },
                include: { grupoFamiliar: true } // incluye todos los miembros del grupo
            });

            if (!affiliate) {
                throw new Error('Afiliado no encontrado');
            }

            if (affiliate.parentesco === 'Titular') {
                const groupMembers = await prisma.afiliado.findMany({
                    where: { idGrupoFamiliarFK: affiliate.idGrupoFamiliarFK }
                });

                dnisToDelete = groupMembers.map(a => a.dni);
            } else {
                dnisToDelete = [affiliate.dni];
            }

            // 1️⃣ Eliminar teléfonos relacionados
            await prisma.afiliadoTelefono.deleteMany({
                where: { dniFK: { in: dnisToDelete } }
            });

            // 2️⃣ Eliminar emails relacionados
            await prisma.afiliadoEmail.deleteMany({
                where: { dniFK: { in: dnisToDelete } }
            });

            // 3️⃣ Eliminar situaciones terapéuticas
            await prisma.situacionAfiliado.deleteMany({
                where: { dniFK: { in: dnisToDelete } }
            });

            // 4️⃣ Finalmente, eliminar afiliados
            const deleted = await prisma.afiliado.deleteMany({
                where: { dni: { in: dnisToDelete } }
            });


            return { message: `Se eliminaron ${deleted.count} afiliados` };
        } catch (error) {
            console.log(error)
            throw new Error(`No se pudo eliminar el afiliado: ${error.message}`);
        }
    }
    // Obtener situaciones terapéuticas por DNI
    async getTherapeuticSituationsByDni(dni) {
        try {
            const situaciones = await prisma.situacionAfiliado.findMany({
                where: { dniFK: dni },
                include: { situacionTerapeutica: true },
                orderBy: { fechaInicio: 'desc' }
            });

            return situaciones.map(s => situacionMapper.map(s));
        } catch (error) {
            throw new Error("No se pudieron obtener las situaciones terapéuticas")
        }
    }

    async existFamilyGroup(familyGroupId) {
        try {
            const grupo = await prisma.grupoFamiliar.findUnique({
                where: { idGrupoFamiliar: parseInt(familyGroupId) }
            })
            return grupo !== null
        } catch (error) {
            throw new Error("No se pudo verificar la existencia del grupo familiar")
        }
    }

    // Listar grupo familiar completo
    async getByFamilyGroupId(familyGroupId) {
        try {
            const grupo = await prisma.grupoFamiliar.findUnique({
                where: { idGrupoFamiliar: parseInt(familyGroupId) },
                include: { plan: true }
            });

            if (!grupo) return null;

            const miembros = await prisma.afiliado.findMany({
                where: { idGrupoFamiliarFK: parseInt(familyGroupId) }
            });

            const afiliadosMapeados = miembros.map(m => mapper.map(m));

            return { grupo, afiliados: afiliadosMapeados };
        } catch (error) {
            throw new Error('No se pudieron obtener los miembros del grupo familiar');
        }
    }

    // Verificar existencia de grupo familiar
    async existFamilyGroup(familyGroupId) {
        try {
            const grupo = await prisma.grupoFamiliar.findUnique({
                where: { idGrupoFamiliar: parseInt(familyGroupId) }
            });
            return grupo !== null;
        } catch (error) {
            throw new Error('No se pudo verificar la existencia del grupo familiar');
        }
    }

    // Contar titulares registrados
    async getCount() {
        try {
            return await prisma.afiliado.count({
                where: { parentesco: 'Titular' }
            });
        } catch (error) {
            throw new Error('No se pudo obtener la cantidad de afiliados titulares');
        }
    }

    // Verificar existencia por DNI
    async existByDni(dni) {
        const affiliate = await prisma.afiliado.findUnique({ where: { dni } });
        return affiliate !== null;
    }
}

module.exports = AffiliateRepository;
