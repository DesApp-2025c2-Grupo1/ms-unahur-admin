/*
  Warnings:

  - The primary key for the `Plan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Plan` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Plan` table. All the data in the column will be lost.
  - You are about to drop the `Affiliate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AffiliateSituation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FamilyGroup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TherapeuticSituation` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `nombre` to the `Plan` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Affiliate" DROP CONSTRAINT "Affiliate_familyGroupId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AffiliateSituation" DROP CONSTRAINT "AffiliateSituation_dni_fkey";

-- DropForeignKey
ALTER TABLE "public"."AffiliateSituation" DROP CONSTRAINT "AffiliateSituation_situationId_fkey";

-- DropForeignKey
ALTER TABLE "public"."FamilyGroup" DROP CONSTRAINT "FamilyGroup_planId_fkey";

-- AlterTable
ALTER TABLE "Plan" DROP CONSTRAINT "Plan_pkey",
DROP COLUMN "id",
DROP COLUMN "name",
ADD COLUMN     "idPlan" SERIAL NOT NULL,
ADD COLUMN     "nombre" VARCHAR(25) NOT NULL,
ADD CONSTRAINT "Plan_pkey" PRIMARY KEY ("idPlan");

-- DropTable
DROP TABLE "public"."Affiliate";

-- DropTable
DROP TABLE "public"."AffiliateSituation";

-- DropTable
DROP TABLE "public"."FamilyGroup";

-- DropTable
DROP TABLE "public"."TherapeuticSituation";

-- CreateTable
CREATE TABLE "GrupoFamiliar" (
    "idGrupoFamiliar" SERIAL NOT NULL,
    "nro_afiliado" VARCHAR(25) NOT NULL,
    "idPlanFK" INTEGER NOT NULL,

    CONSTRAINT "GrupoFamiliar_pkey" PRIMARY KEY ("idGrupoFamiliar")
);

-- CreateTable
CREATE TABLE "Afiliado" (
    "dni" INTEGER NOT NULL,
    "idGrupoFamiliarFK" INTEGER NOT NULL,
    "nombre" VARCHAR(25) NOT NULL,
    "apellido" VARCHAR(25) NOT NULL,
    "parentesco" VARCHAR(25) NOT NULL,
    "credencial" VARCHAR(25) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "telefono" VARCHAR(25) NOT NULL,
    "direccion" VARCHAR(25) NOT NULL,
    "tipoDocumento" VARCHAR(5) NOT NULL,

    CONSTRAINT "Afiliado_pkey" PRIMARY KEY ("dni")
);

-- AddForeignKey
ALTER TABLE "GrupoFamiliar" ADD CONSTRAINT "GrupoFamiliar_idPlanFK_fkey" FOREIGN KEY ("idPlanFK") REFERENCES "Plan"("idPlan") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Afiliado" ADD CONSTRAINT "Afiliado_idGrupoFamiliarFK_fkey" FOREIGN KEY ("idGrupoFamiliarFK") REFERENCES "GrupoFamiliar"("idGrupoFamiliar") ON DELETE RESTRICT ON UPDATE CASCADE;
