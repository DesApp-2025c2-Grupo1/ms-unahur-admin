const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const planes = [
  { idPlan: 1, nombre: '210' },
  { idPlan: 2, nombre: '310' },
  { idPlan: 3, nombre: '410' },
  { idPlan: 4, nombre: '510' },
  { idPlan: 5, nombre: 'Bronce' },
  { idPlan: 6, nombre: 'Plata' },
  { idPlan: 7, nombre: 'Oro' },
  { idPlan: 8, nombre: 'Platino' },
];

const especialidades = [
  { idEspecialidad: 1, nombre: 'Clínica' },
  { idEspecialidad: 2, nombre: 'Pediatría' },
  { idEspecialidad: 3, nombre: 'Cardiología' },
  { idEspecialidad: 4, nombre: 'Dermatología' },
  { idEspecialidad: 5, nombre: 'Oftalmología' },
  { idEspecialidad: 6, nombre: 'Otorrinolaringología' },
  { idEspecialidad: 7, nombre: 'Ginecología' },
  { idEspecialidad: 8, nombre: 'Resonancias' },
];

const situacionesTerapeuticas = [
  { idSituacion: 1, nombre: 'Fonoaudiología' },
  { idSituacion: 2, nombre: 'Psicología' },
  { idSituacion: 3, nombre: 'Psicopedagogía' },
  { idSituacion: 4, nombre: 'Terapia Ocupacional' },
  { idSituacion: 5, nombre: 'Kinesiología' },
  { idSituacion: 6, nombre: 'Acompañante Terapéutico' },
];

async function main() {
  // Seed de planes
  for (const plan of planes) {
    await prisma.plan.upsert({
      where: { idPlan: plan.idPlan },
      update: { nombre: plan.nombre },
      create: plan,
    });
  }

  // Seed de especialidades
  for (const especialidad of especialidades) {
    await prisma.especialidad.upsert({
      where: { idEspecialidad: especialidad.idEspecialidad },
      update: { nombre: especialidad.nombre },
      create: especialidad,
    });
  }

  // Seed de situaciones terapéuticas
  for (const situacion of situacionesTerapeuticas) {
    await prisma.situacionTerapeutica.upsert({
      where: { idSituacion: situacion.idSituacion },
      update: { nombre: situacion.nombre },
      create: situacion,
    });
  }

}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    await prisma.$disconnect();
    process.exit(1);
  });
