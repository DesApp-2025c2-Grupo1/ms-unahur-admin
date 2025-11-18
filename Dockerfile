# Dockerfile para Backend Node.js con Prisma
FROM node:18-alpine

# Instalar dependencias necesarias para Prisma
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY prisma ./prisma/

# Establecer variable de entorno para ignorar error de checksum en entornos con problemas de red
ENV PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1

# Instalar dependencias (postinstall ejecutará prisma generate automáticamente)
RUN npm install

# Copiar el código fuente
COPY . .

# Exponer el puerto
EXPOSE 3000

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=3000

# Ejecutar migraciones, seed y arrancar la aplicación
CMD ["sh", "-c", "npx prisma migrate deploy && npm run seed && node src/index.js"]
