-- AlterTable
ALTER TABLE "Afiliado" ADD COLUMN     "es_programada" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "fecha_alta" TIMESTAMP(3),
ADD COLUMN     "fecha_nacimiento" TIMESTAMP(3);
