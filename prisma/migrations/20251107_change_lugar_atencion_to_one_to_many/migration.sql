-- Paso 1: Agregar columna cuitCuilFK a LugarAtencion (nullable por ahora)
ALTER TABLE "LugarAtencion" ADD COLUMN "cuitCuilFK" VARCHAR(25);

-- Paso 2: Para cada lugar, asignarle el prestador que lo usaba
UPDATE "LugarAtencion" l
SET "cuitCuilFK" = p."cuitCuil"
FROM "Prestador" p
WHERE p."idLugarFK" = l."idLugar";

-- Paso 3: Eliminar la Foreign Key idLugarFK de Prestador
ALTER TABLE "Prestador" DROP CONSTRAINT IF EXISTS "Prestador_idLugarFK_fkey";

-- Paso 4: Eliminar la columna idLugarFK de Prestador
ALTER TABLE "Prestador" DROP COLUMN IF EXISTS "idLugarFK";

-- Paso 5: Agregar Foreign Key de LugarAtencion hacia Prestador (con cuitCuilFK nullable)
ALTER TABLE "LugarAtencion" ADD CONSTRAINT "LugarAtencion_cuitCuilFK_fkey" 
FOREIGN KEY ("cuitCuilFK") REFERENCES "Prestador"("cuitCuil") ON DELETE RESTRICT ON UPDATE CASCADE;
