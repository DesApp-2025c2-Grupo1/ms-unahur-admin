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

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Seed de planes
  console.log('📋 Insertando planes...');
  for (const plan of planes) {
    await prisma.plan.upsert({
      where: { idPlan: plan.idPlan },
      update: { nombre: plan.nombre },
      create: plan,
    });
  }
  console.log(`✅ ${planes.length} planes insertados/actualizados`);

  // Seed de especialidades
  console.log('📋 Insertando especialidades...');
  for (const especialidad of especialidades) {
    await prisma.especialidad.upsert({
      where: { idEspecialidad: especialidad.idEspecialidad },
      update: { nombre: especialidad.nombre },
      create: especialidad,
    });
  }
  console.log(`✅ ${especialidades.length} especialidades insertadas/actualizadas`);

  console.log('🎉 Seed completado exitosamente');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error durante el seed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
