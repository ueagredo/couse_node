const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

const action = process.argv[2]; // argumento desde consola


async function deleteUser() {
  const appointmentId = parseInt(process.argv[3])// ← Cambia esto por el id que quieres eliminar

  try {
    const deleted = await prisma.user.delete({
      where: {
        id: appointmentId,
      },
    })

    console.log('user eliminado:', deleted)
  } catch (error) {
    console.error('Error al eliminar:', error)
  } finally {
    await prisma.$disconnect()
  }
}




async function createUsers() {
  await prisma.user.createMany({
    data: [
      {
        name: 'Alice',
        email: 'alice@example.com',
        password: '123',
        role: 'USER',
      },
      {
        name: 'Bob',
        email: 'bob@example.com',
        password: '123',
        role: 'ADMIN',
      },
    ],
  });
  console.log('Usuarios creados');
}

async function createAppointments() {
  const user = await prisma.user.findFirst(); // cualquiera
  if (!user) {
    console.log('No hay usuarios para crear citas');
    return;
  }

  await prisma.appointment.createMany({
    data: [
      { date: new Date(), time: '09:00', userId: user.id },
      { date: new Date(), time: '11:00', userId: user.id },
    ],
  });
  console.log('Citas creadas');
}

async function main() {
  if (action === 'users') await createUsers();
  else if (action === 'appointments') await createAppointments();
  else if (action === 'delete-user') await deleteUser();
  else console.log('Acción no reconocida. Usa: users o appointments');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
