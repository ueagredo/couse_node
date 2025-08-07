import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function test() {
  const reservation = await prisma.appointment.findFirst();
  console.log('Reservation:', reservation);
}

test();
