const reservationService = require('../services/reservationService');

exports.createReservation = async (req, res) => {
    try {
        
        const reservation = await reservationService.createReservationService(req.body);
        res.status(201).json(reservation);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

exports.getReservation = async (req, res) => {
    try {
        if(!req.params.id){
            return res.status(400).json({ error: 'Reservation ID is required' });
        }

        const reservation = await reservationService.getReservationService(req.params.id);
        if (!reservation) {
            return res.status(404).json({ error: 'Reservation not found' });
        }
        res.status(200).json(reservation);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

exports.updateReservation = async (req, res) => {
    try {

        if(!req.params.id){
            return res.status(400).json({ error: 'Reservation ID is required' });
        }
        const updatedReservation = await reservationService.updateReservationService(req.params.id, req.body);
        if (!updatedReservation) {
            return res.status(404).json({ error: 'Reservation not found' });
        }
        res.status(200).json(updatedReservation);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

exports.deleteReservation = async (req, res) => {
    try {
        if(!req.params.id){
            return res.status(400).json({ error: 'Reservation ID is required' });
        }
        const deletedReservation = await reservationService.deleteReservationService(req.params.id);
        if (!deletedReservation) {
            return res.status(404).json({ error: 'Reservation not found' });
        }
        res.status(200).json({ message: 'Reservation deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    reservationController: exports
};