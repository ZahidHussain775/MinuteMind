const express = require('express');

const router = express.Router();

const auth = require('../controllers/auth.controller');

router.post('/register', auth.resgister);
router.post('/login' , auth.login);
router.post('/logout', auth.logout); 
router.get('/me', auth.getMe);

module.exports = router;    