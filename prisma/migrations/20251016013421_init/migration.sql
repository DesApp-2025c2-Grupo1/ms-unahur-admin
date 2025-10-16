-- CreateTable
CREATE TABLE "Plan" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FamilyGroup" (
    "id" SERIAL NOT NULL,
    "baseAffiliateNum" TEXT NOT NULL,
    "planId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FamilyGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Affiliate" (
    "dni" TEXT NOT NULL,
    "familyGroupId" INTEGER NOT NULL,
    "memberNumber" INTEGER NOT NULL,
    "credential" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "relationship" TEXT NOT NULL,
    "validFrom" TIMESTAMP(3) NOT NULL,
    "validUntil" TIMESTAMP(3),

    CONSTRAINT "Affiliate_pkey" PRIMARY KEY ("dni")
);

-- CreateTable
CREATE TABLE "TherapeuticSituation" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "TherapeuticSituation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AffiliateSituation" (
    "id" SERIAL NOT NULL,
    "situationId" INTEGER NOT NULL,
    "dni" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "observation" TEXT,

    CONSTRAINT "AffiliateSituation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FamilyGroup" ADD CONSTRAINT "FamilyGroup_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Affiliate" ADD CONSTRAINT "Affiliate_familyGroupId_fkey" FOREIGN KEY ("familyGroupId") REFERENCES "FamilyGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AffiliateSituation" ADD CONSTRAINT "AffiliateSituation_dni_fkey" FOREIGN KEY ("dni") REFERENCES "Affiliate"("dni") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AffiliateSituation" ADD CONSTRAINT "AffiliateSituation_situationId_fkey" FOREIGN KEY ("situationId") REFERENCES "TherapeuticSituation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
