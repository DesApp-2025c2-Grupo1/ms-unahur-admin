-- CreateEnum
CREATE TYPE "TipoPrestador" AS ENUM ('profesional', 'centro_medico');

-- CreateEnum
CREATE TYPE "DiaSemana" AS ENUM ('Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo');

-- CreateTable
CREATE TABLE "Prestador" (
    "cuitCuil" VARCHAR(25) NOT NULL,
    "nombreCompleto" VARCHAR(100) NOT NULL,
    "tipoPrestador" "TipoPrestador" NOT NULL,
    "centroMedicoId" VARCHAR(25),
    "idLugarFK" INTEGER,

    CONSTRAINT "Prestador_pkey" PRIMARY KEY ("cuitCuil")
);

-- CreateTable
CREATE TABLE "LugarAtencion" (
    "idLugar" SERIAL NOT NULL,
    "direccion" VARCHAR(100) NOT NULL,
    "localidad" VARCHAR(50) NOT NULL,
    "codigoPostal" VARCHAR(15) NOT NULL,
    "provincia" VARCHAR(50) NOT NULL,

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
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3),
    "duracionTurno" INTEGER NOT NULL,

    CONSTRAINT "Agenda_pkey" PRIMARY KEY ("idAgenda")
);

-- CreateIndex
CREATE UNIQUE INDEX "PrestadorEspecialidad_cuitCuilFK_idEspecialidadFK_key" ON "PrestadorEspecialidad"("cuitCuilFK", "idEspecialidadFK");

-- AddForeignKey
ALTER TABLE "Prestador" ADD CONSTRAINT "Prestador_centroMedicoId_fkey" FOREIGN KEY ("centroMedicoId") REFERENCES "Prestador"("cuitCuil") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prestador" ADD CONSTRAINT "Prestador_idLugarFK_fkey" FOREIGN KEY ("idLugarFK") REFERENCES "LugarAtencion"("idLugar") ON DELETE SET NULL ON UPDATE CASCADE;

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
