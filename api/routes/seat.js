const express = require('express');
const router = express.Router();
const SeatController = require('../controllers/seat');

router.post('/', SeatController.addSeat);

router.get('/', SeatController.getAllSeats);

router.post('/getSeatsByFloor', SeatController.getSeatsByFloor);//GetListOfFloors() and GetSeatsByFloor

router.get('/:id', SeatController.getOneSeat);

router.delete('/:id', SeatController.deleteSeats);

router.delete('/', SeatController.deleteSeats);

module.exports = router;