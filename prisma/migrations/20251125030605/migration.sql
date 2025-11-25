/*
  Warnings:

  - Added the required column `idLugarFK` to the `Agenda` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Agenda" ADD COLUMN     "esta_activo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "idLugarFK" INTEGER NOT NULL,
ALTER COLUMN "fechaInicio" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "BloqueHorarioAgenda" (
    "idBloque" SERIAL NOT NULL,
    "idAgendaFK" INTEGER NOT NULL,
    "diaSemana" "DiaSemana" NOT NULL,
    "horaDesde" VARCHAR(5) NOT NULL,
    "horaHasta" VARCHAR(5) NOT NULL,

    CONSTRAINT "BloqueHorarioAgenda_pkey" PRIMARY KEY ("idBloque")
);

-- CreateIndex
CREATE INDEX "BloqueHorarioAgenda_idAgendaFK_idx" ON "BloqueHorarioAgenda"("idAgendaFK");

-- CreateIndex
CREATE INDEX "Agenda_cuitCuilFK_idx" ON "Agenda"("cuitCuilFK");

-- CreateIndex
CREATE INDEX "Agenda_idEspecialidadFK_idx" ON "Agenda"("idEspecialidadFK");

-- CreateIndex
CREATE INDEX "Agenda_idLugarFK_idx" ON "Agenda"("idLugarFK");

-- AddForeignKey
ALTER TABLE "Agenda" ADD CONSTRAINT "Agenda_idLugarFK_fkey" FOREIGN KEY ("idLugarFK") REFERENCES "LugarAtencion"("idLugar") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BloqueHorarioAgenda" ADD CONSTRAINT "BloqueHorarioAgenda_idAgendaFK_fkey" FOREIGN KEY ("idAgendaFK") REFERENCES "Agenda"("idAgenda") ON DELETE CASCADE ON UPDATE CASCADE;
