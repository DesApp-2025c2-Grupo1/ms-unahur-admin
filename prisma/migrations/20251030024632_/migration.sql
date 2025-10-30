/*
  Warnings:

  - You are about to drop the column `email` on the `Afiliado` table. All the data in the column will be lost.
  - You are about to drop the column `telefono` on the `Afiliado` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Afiliado" DROP COLUMN "email",
DROP COLUMN "telefono";

-- CreateTable
CREATE TABLE "AfiliadoEmail" (
    "id" SERIAL NOT NULL,
    "dniFK" VARCHAR(25) NOT NULL,
    "email" VARCHAR(50) NOT NULL,

    CONSTRAINT "AfiliadoEmail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AfiliadoTelefono" (
    "id" SERIAL NOT NULL,
    "dniFK" VARCHAR(25) NOT NULL,
    "telefono" VARCHAR(25) NOT NULL,

    CONSTRAINT "AfiliadoTelefono_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AfiliadoEmail_dniFK_email_key" ON "AfiliadoEmail"("dniFK", "email");

-- CreateIndex
CREATE UNIQUE INDEX "AfiliadoTelefono_dniFK_telefono_key" ON "AfiliadoTelefono"("dniFK", "telefono");

-- AddForeignKey
ALTER TABLE "AfiliadoEmail" ADD CONSTRAINT "AfiliadoEmail_dniFK_fkey" FOREIGN KEY ("dniFK") REFERENCES "Afiliado"("dni") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AfiliadoTelefono" ADD CONSTRAINT "AfiliadoTelefono_dniFK_fkey" FOREIGN KEY ("dniFK") REFERENCES "Afiliado"("dni") ON DELETE RESTRICT ON UPDATE CASCADE;
