const { PrismaClient } = require('@prisma/client');
const { parse } = require('dotenv');

const prisma = new PrismaClient();

exports.createReservationService = async (data) => {
    try {
        const conflict = await prisma.appointment.findFirst({
            where: {
                date: data.date,
                timeBlockId: data.timeBlockId
            }
        });
        if (conflict) {
            throw new Error('Time block already booked');
        }
        const newReservation = await prisma.appointment.create({
            data })
        return newReservation;
    } catch (error) {
        console.error('🔥 Error creating reservation:', error);
        throw error;
    }
}

exports.getReservationService = async (id) => {
    try {
        const reservation = await prisma.appointment.findUnique({
            where: { id: parseInt(id) },
            include: {
                user: true,
                timeBlock: true
            }
        });
        return reservation;
    } catch (error) {
        console.error('🔥 Error fetching reservation:', error);
        throw error;
    }
}

exports.updateReservationService = async (id, data) => {
    try {
        const conflict = await prisma.appointment.findFirst({
            where: { date: data.date,
                timeBlockId: data.timeBlockId,
                id: {not: parseInt(id) } }
        });
        if(conflict) {
            throw new Error('Time block already booked');
        }
        return prisma.appointment.update({
            where: { id: parseInt(id) },
            data
        });
    } catch (error) {
        console.error('🔥 Error updating reservation:', error);
        throw error;
    }
}

exports.deleteReservationService = async (id) => {
    try {
        const deletedReservation = await prisma.appointment.delete({
            where: { id: parseInt(id) }
        });
        return deletedReservation;
    } catch (error) {
        console.error('🔥 Error deleting reservation:', error);
        throw error;
    }
}
