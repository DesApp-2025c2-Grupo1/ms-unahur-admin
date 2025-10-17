const { PrismaClient } = require('@prisma/client');
const AffiliateMapper = require('../../mapper/AffiliateMapper');

const prisma = new PrismaClient();
const mapper = new AffiliateMapper();

class AffiliateRepository {

    async create({ dni, firstName, lastName, birthDate, plan, relationship, familyGroupId, documentType, validFrom,validUntil}) {
        try {
            // Contar todos los afiliados existentes para el número global
            const totalAffiliates = await prisma.affiliate.count();
            const globalNumber = totalAffiliates + 1; // Incremental X

            // Contar cuántos miembros ya existen en este familyGroup
            const familyCount = await prisma.affiliate.count({
                where: { familyGroupId }
            });

            // Si es titular, siempre 01; si no, incrementar
            const memberNumber = relationship.toLowerCase() === 'titular' ? 1 : familyCount + 1;

            // Generar credential
            // Formato 000000X-YY
            const credential = `000000${globalNumber}-${memberNumber.toString().padStart(2, '0')}`;

            // Crear afiliado
            const affiliate = await prisma.affiliate.create({
                data: {
                    dni,
                    firstName,
                    lastName,
                    birthDate,
                    // plan,
                    familyGroupId,
                    memberNumber,
                    credential,
                    relationship,
                    documentType,
                    validFrom: new Date(validFrom),
                    validUntil: validUntil ? new Date(validUntil) : null
                }
            });

            return affiliate;
        } catch (err) {
            throw new Error(`Error al crear el afiliado: ${err.message}`);
        }
    }

    async findAll() {
        try {
            const affiliates = await prisma.affiliate.findMany({
                where: { relationship: 'Titular' }
            });
            // return affiliates.map(a => mapper.mapToEntity(a));
            return affiliates.map(a => mapper.mapToEntity(a));
        } catch (err) {
            throw new Error(`Error al listar los afiliados: ${err.message}`);
        }
    }

    async delete(dni) {
        try {
            // Buscar al afiliado por DNI
            const affiliate = await prisma.affiliate.findUnique({
                where: { dni }
            });

            if (!affiliate) {
                throw new Error('Afiliado no encontrado');
            }

            // Si es titular (memberNumber === 1), eliminar todo el grupo familiar
            if (affiliate.memberNumber === 1) {
                // Eliminar todos los afiliados del mismo familyGroup
                const deletedGroup = await prisma.affiliate.deleteMany({
                    where: { familyGroupId: affiliate.familyGroupId }
                });
                console.log(`Se eliminaron ${deletedGroup.count} afiliados del grupo familiar ${affiliate.familyGroupId}`);
                return deletedGroup;
            } else {
                // Si no es titular, eliminar solo al afiliado
                const deletedAffiliate = await prisma.affiliate.delete({
                    where: { dni }
                });
                console.log(`Se eliminó al afiliado ${dni}`);
                return deletedAffiliate;
            }
        } catch (err) {
            throw new Error(`No se pudo eliminar el afiliado: ${err.message}`);
        }
    }

    async listFamilyGroup(familyGroupId) {
        try {
            const affiliates = await prisma.affiliate.findMany({
                where: { familyGroupId: parseInt(familyGroupId) }
            });
             return affiliates.map(a => mapper.mapToEntity(a));
        } catch (err) {
            throw new Error(`Error al listar el grupo familiar: ${err.message}`);
        }
    }
}

module.exports = AffiliateRepository;
