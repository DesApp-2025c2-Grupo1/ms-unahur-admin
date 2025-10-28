/*
  Warnings:

  - You are about to drop the column `nro_afiliado` on the `GrupoFamiliar` table. All the data in the column will be lost.
  - Added the required column `nroAfiliado` to the `GrupoFamiliar` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GrupoFamiliar" DROP COLUMN "nro_afiliado",
ADD COLUMN     "nroAfiliado" VARCHAR(25) NOT NULL;

-- CreateTable
CREATE TABLE "SituacionAfiliado" (
    "idSituacionAfiliado" SERIAL NOT NULL,
    "dniFK" INTEGER NOT NULL,
    "observacion" VARCHAR(255) NOT NULL,

    CONSTRAINT "SituacionAfiliado_pkey" PRIMARY KEY ("idSituacionAfiliado")
);

-- AddForeignKey
ALTER TABLE "SituacionAfiliado" ADD CONSTRAINT "SituacionAfiliado_dniFK_fkey" FOREIGN KEY ("dniFK") REFERENCES "Afiliado"("dni") ON DELETE RESTRICT ON UPDATE CASCADE;
