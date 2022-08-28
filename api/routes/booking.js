const express = require('express');
const router = express.Router();
const BookingController = require('../controllers/booking');

router.post('/', BookingController.createBooking);

router.post('/confirmBooking', BookingController.confirmBooking);

router.post('/getSeatsForBooking', BookingController.getSeatsForBooking);

module.exports = router;