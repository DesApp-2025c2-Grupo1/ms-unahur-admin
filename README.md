# 🧩 Mediuhaur - Backend

### 1️⃣ Levantar los contenedores con Docker

Ejecuta el siguiente comando desde la raíz del proyecto:

```bash
docker-compose up -d
```

Esto iniciará todos los servicios definidos en el archivo `docker-compose.yml`.

📦 **pgAdmin** estará disponible en el puerto **8888**.

---

### 2️⃣ Generar el cliente de Prisma

Una vez que los contenedores estén corriendo, ejecuta:

```bash
npx prisma generate
```

Esto genera el cliente de Prisma necesario para interactuar con la base de datos.

---

### 3️⃣ Aplicar las migraciones

Por último, aplica las migraciones a la base de datos:

```bash
npx prisma migrate dev
```

---

## 💡 Notas útiles

* Verifica que el archivo `.env` contenga las variables correctas, especialmente la conexión a la base de datos (`DATABASE_URL`).
* Si realizás cambios en el esquema (`schema.prisma`), recordá volver a ejecutar:

```bash
npx prisma generate
npx prisma migrate dev
```

Para acceder a **pgAdmin**, abrí tu navegador en:
👉 [http://localhost:8888](http://localhost:8888)

### Levantar el servidor 

```bash
npm run dev
```