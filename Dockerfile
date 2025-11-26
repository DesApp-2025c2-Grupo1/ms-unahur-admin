# Dockerfile para Backend Node.js con Prisma
FROM node:18-alpine

# Instalar dependencias necesarias para Prisma y zona horaria
RUN apk add --no-cache openssl libc6-compat tzdata \
    && cp /usr/share/zoneinfo/America/Argentina/Buenos_Aires /etc/localtime \
    && echo "America/Argentina/Buenos_Aires" > /etc/timezone

WORKDIR /app

# Evitar errores de prisma engines
ENV PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1

# Copiar archivos de dependencias
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependencias
RUN npm install

# Copiar el código fuente
COPY . .

# Exponer puerto
EXPOSE 3000

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=3000

# Migraciones, seed y ejecución del servidor
CMD ["sh", "-c", "npx prisma migrate deploy && npm run seed && node src/index.js"]
