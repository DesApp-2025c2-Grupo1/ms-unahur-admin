-- DropForeignKey
ALTER TABLE "public"."LugarAtencion" DROP CONSTRAINT "LugarAtencion_cuitCuilFK_fkey";

-- AddForeignKey
ALTER TABLE "LugarAtencion" ADD CONSTRAINT "LugarAtencion_cuitCuilFK_fkey" FOREIGN KEY ("cuitCuilFK") REFERENCES "Prestador"("cuitCuil") ON DELETE SET NULL ON UPDATE CASCADE;
