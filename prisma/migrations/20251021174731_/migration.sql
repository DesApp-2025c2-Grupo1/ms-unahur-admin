/*
  Warnings:

  - You are about to drop the column `observacion` on the `SituacionAfiliado` table. All the data in the column will be lost.
  - Added the required column `fechaInicio` to the `SituacionAfiliado` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idSituacionFK` to the `SituacionAfiliado` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SituacionAfiliado" DROP COLUMN "observacion",
ADD COLUMN     "fechaFin" TIMESTAMP(3),
ADD COLUMN     "fechaInicio" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "idSituacionFK" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "SituacionTerapeutica" (
    "idSituacion" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,

    CONSTRAINT "SituacionTerapeutica_pkey" PRIMARY KEY ("idSituacion")
);

-- AddForeignKey
ALTER TABLE "SituacionAfiliado" ADD CONSTRAINT "SituacionAfiliado_idSituacionFK_fkey" FOREIGN KEY ("idSituacionFK") REFERENCES "SituacionTerapeutica"("idSituacion") ON DELETE RESTRICT ON UPDATE CASCADE;
