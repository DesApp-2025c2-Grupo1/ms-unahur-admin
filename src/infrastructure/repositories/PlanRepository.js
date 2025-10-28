const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class PlanRepository {

    async findAll() {
        const plans = await prisma.plan.findMany();
        return plans;
    }
}

module.exports = PlanRepository;