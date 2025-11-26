-- CreateEnum
CREATE TYPE "TipoPrestador" AS ENUM ('profesional', 'centro_medico');

-- CreateEnum
CREATE TYPE "DiaSemana" AS ENUM ('Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo');

-- CreateTable
CREATE TABLE "Plan" (
    "idPlan" SERIAL NOT NULL,
    "nombre" VARCHAR(25) NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("idPlan")
);

-- CreateTable
CREATE TABLE "GrupoFamiliar" (
    "idGrupoFamiliar" SERIAL NOT NULL,
    "nroAfiliado" VARCHAR(25) NOT NULL,
    "idPlanFK" INTEGER NOT NULL,

    CONSTRAINT "GrupoFamiliar_pkey" PRIMARY KEY ("idGrupoFamiliar")
);

-- CreateTable
CREATE TABLE "Afiliado" (
    "dni" VARCHAR(25) NOT NULL,
    "idGrupoFamiliarFK" INTEGER NOT NULL,
    "nombre" VARCHAR(25) NOT NULL,
    "apellido" VARCHAR(25) NOT NULL,
    "parentesco" VARCHAR(25) NOT NULL,
    "credencial" VARCHAR(25) NOT NULL,
    "direccion" VARCHAR(50) NOT NULL,
    "tipoDocumento" VARCHAR(5) NOT NULL,
    "fecha_nacimiento" TIMESTAMPTZ,
    "fecha_alta" TIMESTAMPTZ,
    "es_programada" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Afiliado_pkey" PRIMARY KEY ("dni")
);

-- CreateTable
CREATE TABLE "AfiliadoEmail" (
    "id" SERIAL NOT NULL,
    "dniFK" VARCHAR(25) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "esta_activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "AfiliadoEmail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AfiliadoTelefono" (
    "id" SERIAL NOT NULL,
    "dniFK" VARCHAR(25) NOT NULL,
    "telefono" VARCHAR(25) NOT NULL,
    "esta_activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "AfiliadoTelefono_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SituacionAfiliado" (
    "idSituacionAfiliado" SERIAL NOT NULL,
    "idSituacionFK" INTEGER NOT NULL,
    "dniFK" VARCHAR(25) NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3),
    "esta_activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "SituacionAfiliado_pkey" PRIMARY KEY ("idSituacionAfiliado")
);

-- CreateTable
CREATE TABLE "SituacionTerapeutica" (
    "idSituacion" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,

    CONSTRAINT "SituacionTerapeutica_pkey" PRIMARY KEY ("idSituacion")
);

-- CreateTable
CREATE TABLE "Prestador" (
    "cuitCuil" VARCHAR(25) NOT NULL,
    "nombreCompleto" VARCHAR(100) NOT NULL,
    "tipoPrestador" "TipoPrestador" NOT NULL,
    "fechaAlta" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "centroMedicoId" VARCHAR(25),

    CONSTRAINT "Prestador_pkey" PRIMARY KEY ("cuitCuil")
);

-- CreateTable
CREATE TABLE "LugarAtencion" (
    "idLugar" SERIAL NOT NULL,
    "direccion" VARCHAR(100) NOT NULL,
    "localidad" VARCHAR(50) NOT NULL,
    "codigoPostal" VARCHAR(15) NOT NULL,
    "provincia" VARCHAR(50) NOT NULL,
    "cuitCuilFK" VARCHAR(25),

    CONSTRAINT "LugarAtencion_pkey" PRIMARY KEY ("idLugar")
);

-- CreateTable
CREATE TABLE "TelefonoPrestador" (
    "idTelefono" SERIAL NOT NULL,
    "cuitCuilFK" VARCHAR(25) NOT NULL,
    "telefono" VARCHAR(25) NOT NULL,

    CONSTRAINT "TelefonoPrestador_pkey" PRIMARY KEY ("idTelefono")
);

-- CreateTable
CREATE TABLE "MailPrestador" (
    "idMail" SERIAL NOT NULL,
    "cuitCuilFK" VARCHAR(25) NOT NULL,
    "mail" VARCHAR(50) NOT NULL,

    CONSTRAINT "MailPrestador_pkey" PRIMARY KEY ("idMail")
);

-- CreateTable
CREATE TABLE "Especialidad" (
    "idEspecialidad" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,

    CONSTRAINT "Especialidad_pkey" PRIMARY KEY ("idEspecialidad")
);

-- CreateTable
CREATE TABLE "PrestadorEspecialidad" (
    "id" SERIAL NOT NULL,
    "cuitCuilFK" VARCHAR(25) NOT NULL,
    "idEspecialidadFK" INTEGER NOT NULL,

    CONSTRAINT "PrestadorEspecialidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HorarioAtencion" (
    "idHorario" SERIAL NOT NULL,
    "idLugarFK" INTEGER NOT NULL,
    "diaSemana" "DiaSemana" NOT NULL,
    "horaDesde" VARCHAR(5) NOT NULL,
    "horaHasta" VARCHAR(5) NOT NULL,

    CONSTRAINT "HorarioAtencion_pkey" PRIMARY KEY ("idHorario")
);

-- CreateTable
CREATE TABLE "Agenda" (
    "idAgenda" SERIAL NOT NULL,
    "cuitCuilFK" VARCHAR(25) NOT NULL,
    "idEspecialidadFK" INTEGER NOT NULL,
    "idLugarFK" INTEGER NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaFin" TIMESTAMP(3),
    "duracionTurno" INTEGER NOT NULL,
    "esta_activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Agenda_pkey" PRIMARY KEY ("idAgenda")
);

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
CREATE UNIQUE INDEX "AfiliadoEmail_dniFK_email_key" ON "AfiliadoEmail"("dniFK", "email");

-- CreateIndex
CREATE UNIQUE INDEX "AfiliadoTelefono_dniFK_telefono_key" ON "AfiliadoTelefono"("dniFK", "telefono");

-- CreateIndex
CREATE UNIQUE INDEX "PrestadorEspecialidad_cuitCuilFK_idEspecialidadFK_key" ON "PrestadorEspecialidad"("cuitCuilFK", "idEspecialidadFK");

-- CreateIndex
CREATE INDEX "Agenda_cuitCuilFK_idx" ON "Agenda"("cuitCuilFK");

-- CreateIndex
CREATE INDEX "Agenda_idEspecialidadFK_idx" ON "Agenda"("idEspecialidadFK");

-- CreateIndex
CREATE INDEX "Agenda_idLugarFK_idx" ON "Agenda"("idLugarFK");

-- CreateIndex
CREATE INDEX "BloqueHorarioAgenda_idAgendaFK_idx" ON "BloqueHorarioAgenda"("idAgendaFK");

-- AddForeignKey
ALTER TABLE "GrupoFamiliar" ADD CONSTRAINT "GrupoFamiliar_idPlanFK_fkey" FOREIGN KEY ("idPlanFK") REFERENCES "Plan"("idPlan") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Afiliado" ADD CONSTRAINT "Afiliado_idGrupoFamiliarFK_fkey" FOREIGN KEY ("idGrupoFamiliarFK") REFERENCES "GrupoFamiliar"("idGrupoFamiliar") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AfiliadoEmail" ADD CONSTRAINT "AfiliadoEmail_dniFK_fkey" FOREIGN KEY ("dniFK") REFERENCES "Afiliado"("dni") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AfiliadoTelefono" ADD CONSTRAINT "AfiliadoTelefono_dniFK_fkey" FOREIGN KEY ("dniFK") REFERENCES "Afiliado"("dni") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SituacionAfiliado" ADD CONSTRAINT "SituacionAfiliado_idSituacionFK_fkey" FOREIGN KEY ("idSituacionFK") REFERENCES "SituacionTerapeutica"("idSituacion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SituacionAfiliado" ADD CONSTRAINT "SituacionAfiliado_dniFK_fkey" FOREIGN KEY ("dniFK") REFERENCES "Afiliado"("dni") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prestador" ADD CONSTRAINT "Prestador_centroMedicoId_fkey" FOREIGN KEY ("centroMedicoId") REFERENCES "Prestador"("cuitCuil") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LugarAtencion" ADD CONSTRAINT "LugarAtencion_cuitCuilFK_fkey" FOREIGN KEY ("cuitCuilFK") REFERENCES "Prestador"("cuitCuil") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TelefonoPrestador" ADD CONSTRAINT "TelefonoPrestador_cuitCuilFK_fkey" FOREIGN KEY ("cuitCuilFK") REFERENCES "Prestador"("cuitCuil") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MailPrestador" ADD CONSTRAINT "MailPrestador_cuitCuilFK_fkey" FOREIGN KEY ("cuitCuilFK") REFERENCES "Prestador"("cuitCuil") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrestadorEspecialidad" ADD CONSTRAINT "PrestadorEspecialidad_cuitCuilFK_fkey" FOREIGN KEY ("cuitCuilFK") REFERENCES "Prestador"("cuitCuil") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrestadorEspecialidad" ADD CONSTRAINT "PrestadorEspecialidad_idEspecialidadFK_fkey" FOREIGN KEY ("idEspecialidadFK") REFERENCES "Especialidad"("idEspecialidad") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HorarioAtencion" ADD CONSTRAINT "HorarioAtencion_idLugarFK_fkey" FOREIGN KEY ("idLugarFK") REFERENCES "LugarAtencion"("idLugar") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agenda" ADD CONSTRAINT "Agenda_cuitCuilFK_fkey" FOREIGN KEY ("cuitCuilFK") REFERENCES "Prestador"("cuitCuil") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agenda" ADD CONSTRAINT "Agenda_idEspecialidadFK_fkey" FOREIGN KEY ("idEspecialidadFK") REFERENCES "Especialidad"("idEspecialidad") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agenda" ADD CONSTRAINT "Agenda_idLugarFK_fkey" FOREIGN KEY ("idLugarFK") REFERENCES "LugarAtencion"("idLugar") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BloqueHorarioAgenda" ADD CONSTRAINT "BloqueHorarioAgenda_idAgendaFK_fkey" FOREIGN KEY ("idAgendaFK") REFERENCES "Agenda"("idAgenda") ON DELETE CASCADE ON UPDATE CASCADE;
