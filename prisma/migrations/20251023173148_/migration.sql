/*
  Warnings:

  - The primary key for the `Afiliado` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "public"."SituacionAfiliado" DROP CONSTRAINT "SituacionAfiliado_dniFK_fkey";

-- AlterTable
ALTER TABLE "Afiliado" DROP CONSTRAINT "Afiliado_pkey",
ALTER COLUMN "dni" SET DATA TYPE VARCHAR(25),
ADD CONSTRAINT "Afiliado_pkey" PRIMARY KEY ("dni");

-- AlterTable
ALTER TABLE "SituacionAfiliado" ALTER COLUMN "dniFK" SET DATA TYPE VARCHAR(25);

-- AddForeignKey
ALTER TABLE "SituacionAfiliado" ADD CONSTRAINT "SituacionAfiliado_dniFK_fkey" FOREIGN KEY ("dniFK") REFERENCES "Afiliado"("dni") ON DELETE RESTRICT ON UPDATE CASCADE;
