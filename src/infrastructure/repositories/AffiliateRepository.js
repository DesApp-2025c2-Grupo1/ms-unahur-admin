const { PrismaClient } = require('@prisma/client');
const AffiliateMapper = require('../../mapper/AffiliateMapper');


const prisma = new PrismaClient();
const mapper = new AffiliateMapper();

class ProviderRepository {

    async create({ dni, firstName, lastName, birthDate, credential, situations, relationship }) {
        const provider = prisma.affiliate.create({
            data: {
                dni: dni,
                firstName: firstName,
                lastName: lastName,
                birthDate: birthDate,
                credential: credential,
                situations: situations,
                relationship: relationship

            }
        })
        return provider;
    }

    async findAll() {
        const affiliates = await prisma.affilitesgeneralinformation.findMany();
        console.log(affiliates);
        return affiliates.map(affiliate => mapper.mapToEntity(affiliate));
    }

    async delete({ dni }) {

        try {
            await prisma.affiliateSituation.deleteMany({
                where: { dni }
            });
            const deleted = await prisma.affiliate.delete({
                where: { dni }
            });
            return deleted;
        } catch (err) {
            throw new Error(`No se pudo eliminar el afiliado: ${err.message}`);
        }
    }

    async listFamilyGroup({ familyGroupId }) {
        const affiliates = await prisma.affilitesgeneralinformation.findMany({
            where: { familyGroupId: parseInt(familyGroupId) }
        });
        return affiliates.map(affiliate => mapper.mapToEntity(affiliate));
    }
}

module.exports = ProviderRepository;
