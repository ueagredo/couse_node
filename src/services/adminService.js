const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const createTimeBlocksService = async (startTime, endTime) => {

    try {
    console.log('Creating time block:', { startTime, endTime });
    const newTimeBlock = await prisma.timeBlock.create({
        data: {
            startTime: new Date(startTime),
            endTime: new Date(endTime)
        }
    });
    return newTimeBlock;
} catch (error) {
    console.error('🔥 Error creating time block:', error);
    throw error;
}
}

const listReservationsService = async () => {
  console.log('Fetching reservations...');
  try {
    const reservations = await prisma.appointment.findMany({
      include: {
        user: true,
        timeBlock: true
      }
    });
    console.log('Reservations fetched:', reservations);
    return reservations;
  } catch (error) {
    console.error('🔥 Error fetching reservations:', error);
    throw error;
  }
};

module.exports = {
    createTimeBlocksService,
    listReservationsService
};