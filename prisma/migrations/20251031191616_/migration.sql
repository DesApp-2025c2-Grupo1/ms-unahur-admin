-- AlterTable
ALTER TABLE "Afiliado" ADD COLUMN     "esta_activo" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "AfiliadoEmail" ADD COLUMN     "esta_activo" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "AfiliadoTelefono" ADD COLUMN     "esta_activo" BOOLEAN NOT NULL DEFAULT true;
