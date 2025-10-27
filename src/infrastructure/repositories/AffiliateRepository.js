const { PrismaClient } = require('@prisma/client')
const AffiliateMapper = require('../../mapper/AffiliateMapper')
const SituacionAfiliadoMapper = require('../../mapper/SituacionAfiliadoMapper')

const prisma = new PrismaClient()
const mapper = new AffiliateMapper()
const situacionMapper = new SituacionAfiliadoMapper()

class AffiliateRepository {
    async findAll() {
        const affiliates = await prisma.afiliado.findMany({
            where: { parentesco: 'Titular' },
            include: { grupoFamiliar: true }
        })
        return affiliates.map(aff => mapper.map(aff))
    }

    async create({ dni, nombre, apellido, email, telefono, direccion, plan, familiares }) {
        if (await this.existByDni(dni)) {
            throw new Error("El DNI ya se encuentra registrado")
        }
        const count = await this.getCount()
        const nextFamilyNumber = count + 1
        const baseCredencial = nextFamilyNumber.toString().padStart(7, '0')

        try {
            const titular = await prisma.afiliado.create({
                data: {
                    dni,
                    nombre,
                    apellido,
                    credencial: `${baseCredencial}-01`,
                    parentesco: 'Titular',
                    email,
                    telefono,
                    direccion,
                    tipoDocumento: 'DNI',
                    grupoFamiliar: {
                        create: {
                            idPlanFK: plan,
                            nroAfiliado: baseCredencial
                        }
                    }
                },
                include: { grupoFamiliar: true }
            })
            if (familiares && familiares.length > 0) {
                await this.insertFamily(titular, familiares, baseCredencial)
            }
            return null;
        } catch (error) {
            throw new Error("No se pudo crear el afiliado")
        }
    }

    async insertFamily(titular, familiares, baseCredencial) {
        try {
            for (let index = 0; index < familiares.length; index++) {
                const f = familiares[index]
                if (await this.existByDni(f.dni)) {
                    throw new Error(`El DNI ${f.dni} ya se encuentra registrado`)
                }
                const credencialFamiliar = `${baseCredencial}-${(index + 2).toString().padStart(2, '0')}`
                await prisma.afiliado.create({
                    data: {
                        dni: f.dni,
                        nombre: f.nombre,
                        apellido: f.apellido,
                        credencial: credencialFamiliar,
                        parentesco: f.parentesco,
                        email: f.email,
                        telefono: f.telefono,
                        direccion: f.direccion,
                        tipoDocumento: 'DNI',
                        grupoFamiliar: {
                            connect: { idGrupoFamiliar: titular.grupoFamiliar.idGrupoFamiliar }
                        }
                    }
                })
            }
        } catch (error) {
            throw new Error("No se pudieron registrar los familiares")
        }
    }

    async getCount() {
        try {
            const count = await prisma.afiliado.count({
                where: { parentesco: 'Titular' }
            })
            return count
        } catch (error) {
            throw new Error("Could not retrieve affiliate count")
        }
    }

    async existByDni(dni) {
        const affiliate = await prisma.afiliado.findUnique({
            where: { dni }
        })
        return affiliate !== null
    }

    async getTherapeuticSituationsByDni(dni) {
        try {
            const situaciones = await prisma.situacionAfiliado.findMany({
                where: { dniFK: dni },
                include: { situacionTerapeutica: true },
                orderBy: { fechaInicio: 'desc' }
            })

            return situaciones.map(s => situacionMapper.map(s))
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

    async listFamilyGroup(familyGroupId) {
        try {
            const grupo = await prisma.grupoFamiliar.findUnique({
                where: { idGrupoFamiliar: parseInt(familyGroupId) },
                include: { plan: true }
            })

            if (!grupo) return null

            const miembros = await prisma.afiliado.findMany({
                where: { idGrupoFamiliarFK: parseInt(familyGroupId) }
            })

            // mapear afiliados usando el mapper existente
            const mapped = miembros.map(m => mapper.map(m))

            return { grupo, afiliados: mapped }
        } catch (error) {
            throw new Error("No se pudieron obtener los miembros del grupo familiar")
        }
    }
}

module.exports = AffiliateRepository
