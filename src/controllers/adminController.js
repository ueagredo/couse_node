const {createTimeBlocksService, listReservationsService} = require('../services/adminService');

const createTimeBlocks = async (req, res) => {
    try {
        if(req.user.role   !== 'ADMIN') {
            return res.status(403).json({ error: 'Access denied' });
            } 
        const { startTime, endTime } = req.body;
        const newTimeBlock = await createTimeBlocksService(startTime, endTime);
        res.status(201).json(newTimeBlock);
        
        
    } catch (error) {
        res.status(500).json({ error: 'Error creating time block' });
    }
}

const listReservations = async (req, res) => {
    try {

        if(req.user.role   !== 'ADMIN') {
            return res.status(403).json({ error: 'Access denied' });
            } 

        console.log('Listing reservations...');
        const reservations = await listReservationsService();
        console.log('Reservations fetched:', reservations);
        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).json({ error: 'Error listing reservations' });
    }
}   

module.exports = {
    createTimeBlocks,
    listReservations
};