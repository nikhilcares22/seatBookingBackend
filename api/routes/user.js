const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');

router.post('/', UserController.user_signup);

router.put('/:id', UserController.user_edit);

router.get('/', UserController.getAllUsers);

router.get('/:id', UserController.getUser);

router.delete('/:id', UserController.user_delete);

module.exports = router;